import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerSchemas } from './swagger.schemas.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CooPlay API',
      version: '1.0.0',
      description: "Documentation de l'API CooPlay"
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: swaggerSchemas
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs dispo sur http://localhost:5000/api-docs`);
};
