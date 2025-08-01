import swaggerUi from 'swagger-ui-express';
import swaggerDocument from 'swagger-jsdoc';
import { Request } from 'express';
import dotenv from "dotenv";

dotenv.config();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'APP API Documentation',
          version: '1.0.0',
          description: 'API documentation',
        },
        servers: [
          {
            url: process.env.API_DOC_URL,
          },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', 
                },
            },
        },
        security: [
            {
              bearerAuth: [],
            },
        ],
      },
      apis: ['./src/routers/*.ts'],
};

const swaggerDocs = swaggerDocument(swaggerOptions);

export const swaggerui = swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
        requestInterceptor: (req: Request) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                req.headers['Authorization'] = `Bearer ${token}`;
            }
            return req;
        },
        responseInterceptor: (res: any) => {
            // If the response contains a token, store it for future requests
            if (res.body && res.body.token) {
                localStorage.setItem('authToken', res.authToken);
            }
            return res;
        }
    }
});
 
export const sawgerserver = swaggerUi.serve;