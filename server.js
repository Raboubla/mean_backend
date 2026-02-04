const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

// Connexion à MongoDB 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté lesy broo"))
    .catch(err => console.log(err));

// Routes 
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/shops', require('./routes/shop.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/auth',require('./routes/auth.routes.js'));

app.listen(PORT, () => console.log(`Serveur démarré sur le port 
${PORT}`));