const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping Center API',
            version: '1.0.0',
            description: 'API pour la gestion du centre commercial (S7 Cyber Project)',
            contact: {
                name: 'Developer'
            },
            servers: [{ url: 'http://localhost:5000' }]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    // Chemin vers les fichiers contenant les annotations (tes routes)
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/shops', require('./routes/shop.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/communications', require('./routes/communication.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/auth', require('./routes/auth.routes.js'));

app.listen(PORT, () => console.log(`Serveur démarré sur le port 
${PORT}`));