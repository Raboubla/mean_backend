const Communication = require('../models/Communication');
const upload = require('../middlewares/image.middleware');
const path = require('path');

// ==================== BASIC CRUD ====================

// Create a new communication
exports.createCommunication = async (req, res) => {
    try {

        const commData = req.body;

        // Conversion en objets Date pour une comparaison fiable
        const startDate = new Date(commData.start_date);
        const endDate = new Date(commData.end_date);

        if (endDate < startDate) {
            // Note: 400 (Bad Request) est plus approprié que 404 ici
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Si une image a été uploadée, on enregistre son chemin
        if (req.file) {
            commData.image_url = `/uploads/communications/${req.file.filename}`;
        }
        const communication = new Communication(commData);
        await communication.save();

        res.status(201).json({
            message: 'Communication created successfully',
            communication
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all communications
exports.getAllCommunications = async (req, res) => {
    try {
        const communications = await Communication.find()
            .populate('shop', 'name category')
            .sort({ start_date: -1 });

        res.json({
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get communication by ID
exports.getCommunicationById = async (req, res) => {
    try {
        const communication = await Communication.findById(req.params.id)
            .populate('shop', 'name category floor');

        if (!communication) {
            return res.status(404).json({ message: 'Communication not found' });
        }

        res.json(communication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update communication
exports.updateCommunication = async (req, res) => {
    try {
        const commData = req.body;

        // Si une nouvelle image a été uploadée, on enregistre son chemin
        if (req.file) {
            commData.image_url = `/uploads/communications/${req.file.filename}`;

            // Optionnel : Supprimer l'ancienne image si elle existe
            const oldComm = await Communication.findById(req.params.id);
            if (oldComm && oldComm.image_url) {
                const fs = require('fs');
                const oldPath = path.join(__dirname, '..', oldComm.image_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const communication = await Communication.findByIdAndUpdate(
            req.params.id,
            commData,
            { new: true, runValidators: true }
        ).populate('shop', 'name category');

        if (!communication) {
            return res.status(404).json({ message: 'Communication not found' });
        }

        res.json({
            message: 'Communication updated successfully',
            communication
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete communication
exports.deleteCommunication = async (req, res) => {
    try {
        const communication = await Communication.findByIdAndDelete(req.params.id);

        if (!communication) {
            return res.status(404).json({ message: 'Communication not found' });
        }

        res.json({ message: 'Communication deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==================== UTILITY FUNCTIONS ====================

// Get active communications (current date between start_date and end_date)
exports.getActiveCommunications = async (req, res) => {
    try {
        const now = new Date();

        const communications = await Communication.find({
            start_date: { $lte: now },
            end_date: { $gte: now }
        })
            .populate('shop', 'name category')
            .sort({ start_date: -1 });

        res.json({
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get communications by type (ANNOUNCEMENT or EVENT)
exports.getCommunicationsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const typeUpper = type.toUpperCase();

        // Validate type
        const validTypes = ['ANNOUNCEMENT', 'EVENT'];
        if (!validTypes.includes(typeUpper)) {
            return res.status(400).json({
                message: 'Invalid type. Valid types: ANNOUNCEMENT, EVENT'
            });
        }

        const communications = await Communication.find({ type: typeUpper })
            .populate('shop', 'name category')
            .sort({ start_date: -1 });

        res.json({
            type: typeUpper,
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get communications by target audience
exports.getCommunicationsByTarget = async (req, res) => {
    try {
        const { target } = req.params;
        const targetUpper = target.toUpperCase();

        // Validate target
        const validTargets = ['ALL', 'BUYERS', 'SHOP_ADMINS'];
        if (!validTargets.includes(targetUpper)) {
            return res.status(400).json({
                message: 'Invalid target. Valid targets: ALL, BUYERS, SHOP_ADMINS'
            });
        }

        const communications = await Communication.find({ target: targetUpper })
            .populate('shop', 'name category')
            .sort({ start_date: -1 });

        res.json({
            target: targetUpper,
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get communications by shop
exports.getCommunicationsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        const communications = await Communication.find({ shop: shopId })
            .populate('shop', 'name category floor')
            .sort({ start_date: -1 });

        res.json({
            shopId,
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get upcoming communications (start_date in the future)
exports.getUpcomingCommunications = async (req, res) => {
    try {
        const now = new Date();

        const communications = await Communication.find({
            start_date: { $gt: now }
        })
            .populate('shop', 'name category')
            .sort({ start_date: 1 });

        res.json({
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get expired communications (end_date in the past)
exports.getExpiredCommunications = async (req, res) => {
    try {
        const now = new Date();

        const communications = await Communication.find({
            end_date: { $lt: now }
        })
            .populate('shop', 'name category')
            .sort({ end_date: -1 });

        res.json({
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get communications statistics
exports.getCommunicationStatistics = async (req, res) => {
    try {
        const now = new Date();

        // Execute all queries in parallel for better performance
        const [
            total,
            active,
            upcoming,
            expired,
            announcements,
            events,
            targetAll,
            targetBuyers,
            targetShopAdmins
        ] = await Promise.all([
            Communication.countDocuments(),
            Communication.countDocuments({
                start_date: { $lte: now },
                end_date: { $gte: now }
            }),
            Communication.countDocuments({ start_date: { $gt: now } }),
            Communication.countDocuments({ end_date: { $lt: now } }),
            Communication.countDocuments({ type: 'ANNOUNCEMENT' }),
            Communication.countDocuments({ type: 'EVENT' }),
            Communication.countDocuments({ target: 'ALL' }),
            Communication.countDocuments({ target: 'BUYERS' }),
            Communication.countDocuments({ target: 'SHOP_ADMINS' })
        ]);

        res.json({
            statistics: {
                total,
                active,
                upcoming,
                expired
            },
            byType: {
                announcements,
                events
            },
            byTarget: {
                all: targetAll,
                buyers: targetBuyers,
                shopAdmins: targetShopAdmins
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Search communications by title or content
exports.searchCommunications = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const communications = await Communication.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        })
            .populate('shop', 'name category')
            .sort({ start_date: -1 });

        res.json({
            count: communications.length,
            communications
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
