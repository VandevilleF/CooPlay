export const swaggerSchemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      firebase_uid: { type: 'string', example: 'firebase-uid-xyz' },
      email: { type: 'string', example: 'user@email.com' },
      username: { type: 'string', example: 'flo' },
      avatar_id: { type: 'integer', nullable: true, example: null },
      created_at: { type: 'string', format: 'date-time', example: '2025-08-20T12:00:00.000Z' },
      updated_at: { type: 'string', format: 'date-time', example: '2025-08-21T12:30:00.000Z' }
    },
  },

  Game: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 123 },
      name: { type: 'string', example: "Elden Ring" },
      cover_url: { type: 'string', example: "https://image.url/elden.png" },
      released: { type: 'string', format: 'date-time', example: "2022-02-25T00:00:00Z" }
    }
  },

  FavoriteGame: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      gameId: { type: 'integer', example: 12345 },
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
      id: { type: 'integer', example: 1 },
      title: { type: 'string', example: "Tournoi League of Legends" },
      description: { type: 'string', example: "Tournoi amical en 5v5" },
      start_at: { type: 'string', format: 'date-time', example: "2025-09-15T20:00:00Z" },
      max_participants: { type: 'integer', example: 10 },
      created_at: { type: 'string', format: 'date-time', example: "2025-08-20T12:00:00Z" },
      updated_at: { type: 'string', format: 'date-time', example: "2025-08-21T15:00:00Z" },
      creator: { $ref: '#/components/schemas/User' },
      participants: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            joined_at: { type: 'string', format: 'date-time', example: "2025-08-22T14:00:00Z" }
          }
        }
      },
      games: {
        type: 'array',
        items: { $ref: '#/components/schemas/Game' }
      }
    }
  }
};
