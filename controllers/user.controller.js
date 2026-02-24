const User = require('../models/User');
const authService = require('../services/auth.service');

// ==================== BASIC CRUD ====================

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users  (supports ?query=&status=&role= filters)
exports.getAllUsers = async (req, res) => {
  try {
    const { query, status, role } = req.query;
    const filter = {};

    if (query) {
      filter.email = { $regex: query, $options: 'i' };
    }
    if (status) {
      filter.status = status.toUpperCase();
    }
    if (role) {
      filter.role = role.toUpperCase();
    }

    const users = await User.find(filter)
      .populate('shop', 'name category floor')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('shop', 'name category floor')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Prevent password update through this endpoint
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const roleUpper = role.toUpperCase();

    // Validate role
    const validRoles = ['ADMIN', 'BUYERS', 'ADMINSHOP'];
    if (!validRoles.includes(roleUpper)) {
      return res.status(400).json({
        message: 'Invalid role. Valid roles: ADMIN, BUYERS, ADMINSHOP'
      });
    }

    const users = await User.find({ role: roleUpper })
      .populate('shop', 'name category')
      .select('-password');

    res.json({
      role: roleUpper,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users by shop
exports.getUsersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const users = await User.find({ shop: shopId })
      .populate('shop', 'name category floor')
      .select('-password');

    res.json({
      shopId,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users by status
exports.getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const statusUpper = status.toUpperCase();

    const users = await User.find({ status: statusUpper })
      .populate('shop', 'name category')
      .select('-password');

    res.json({
      status: statusUpper,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle user status (ACTIVE/INACTIVE)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle between ACTIVE and INACTIVE
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: `User status changed to ${user.status}`,
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await authService.comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    user.password = await authService.hashPassword(newPassword);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get user statistics
exports.getUserStatistics = async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminCount,
      buyersCount,
      adminShopCount,
      usersWithShop
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'INACTIVE' }),
      User.countDocuments({ role: 'ADMIN' }),
      User.countDocuments({ role: 'BUYERS' }),
      User.countDocuments({ role: 'ADMINSHOP' }),
      User.countDocuments({ shop: { $exists: true, $ne: null } })
    ]);

    res.json({
      statistics: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers
      },
      byRole: {
        admin: adminCount,
        buyers: buyersCount,
        adminShop: adminShopCount
      },
      usersWithShop
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Search users by email
exports.searchUsersByEmail = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      email: { $regex: query, $options: 'i' }
    })
      .populate('shop', 'name category')
      .select('-password');

    res.json({
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};