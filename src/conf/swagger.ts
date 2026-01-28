import swaggerUi from 'swagger-ui-express';
import swaggerDocument from 'swagger-jsdoc';
import { Request } from 'express';
import dotenv from "dotenv";
import { generateZodComponent } from './swagger-registry';

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
      apis: [process.env.API_ROUTES_PATH as string],
};

const swaggerDocs: any = swaggerDocument(swaggerOptions as any);

const zodComponents = generateZodComponent();

swaggerDocs.components = swaggerDocs.components ?? {};
swaggerDocs.components.schemas = {
  ...(swaggerDocs.components.schemas ?? {}),
  ...(zodComponents.schemas ?? {}),
};

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