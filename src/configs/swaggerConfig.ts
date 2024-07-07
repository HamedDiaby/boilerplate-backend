import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Hamed Diaby Koumba',
      },
      servers: ['http://localhost:3000']
    }
  },
  apis: [
    './src/routes/users/*.ts',
  ],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
