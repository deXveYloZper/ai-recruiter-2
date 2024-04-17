import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { verifyToken } from './auth.js';
import logger from './logger.js';
import statusMonitor from 'express-status-monitor';

const app = express();
app.use(statusMonitor());

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const userId = verifyToken(token);
      return { userId };
    },
    plugins: [
      {
        requestDidStart(requestContext) {
          logger.info('Request started', requestContext.request);
  
          return {
            didEncounterErrors(requestContext) {
              logger.error('Request encountered errors', requestContext.errors);
            },
            willSendResponse(requestContext) {
              logger.info('Request completed', requestContext.response);
            },
          };
        },    },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch((error) => {
  logger.error('Error starting server', error);
});


/*
We import the verifyToken function from the auth.js file.
We add a context function to the ApolloServer configuration that extracts the authentication token from the request headers, verifies it, and returns the userId in the context.
With these changes, you have implemented authentication and authorization for the AI recruitment platform. Users can now sign up, log in, and access protected API endpoints based on their authentication status.

We can test the authentication flow using a GraphQL client like Apollo Studio or Postman. 
Send a signup mutation to create a new user, then use the returned token in the Authorization header for subsequent requests to access protected endpoints.

We import the logger from the logger.js file and the statusMonitor from the express-status-monitor library.
We add the statusMonitor middleware to the Express app to enable server monitoring.
We configure the Apollo Server with a plugin that logs the request start, errors, and response using the logger.
We update the server startup logic to log the server start and any errors that occur during startup.
*/