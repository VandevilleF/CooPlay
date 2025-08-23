import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
      schemas: {
        User: {
          type: 'object',
          properties: {
            firebase_uid: { type: 'string', example: 'firebase-uid-xyz' },
            email: { type: 'string', example: 'user@email.com' },
            username: { type: 'string', example: 'flo' },
            avatar_id: { type: 'string', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time', example: '2025-08-20T12:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-08-20T12:30:00.000Z' }
          }
        },
        FavoriteGame: {
          type: 'object',
          properties: {
            id: { type: 'string', example: "1" },
            gameId: { type: 'string', example: "12345" },
            name: { type: 'string', example: "Elden Ring" },
            addedAt: { type: 'string', format: 'date-time', example: "2025-08-21T12:00:00Z" },
          }
        },
        Trophy: {
          type: 'object',
          properties: {
            id: { type: 'string', example: "trophy_01" },
            name: { type: 'string', example: "Premier pas" },
            description: { type: 'string', example: "Inscription réussie" },
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', example: "event_123" },
            title: { type: 'string', example: "Tournoi League of Legends" },
            type: { type: 'string', enum: ['created', 'joined'], example: "joined" },
            date: { type: 'string', format: 'date-time', example: "2025-09-15T20:00:00Z" },
          }
        }
      }
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
