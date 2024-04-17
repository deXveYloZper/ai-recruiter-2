import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { verifyToken } from './auth.js';

const app = express();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const userId = verifyToken(token);
      return { userId };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();


/*
We import the verifyToken function from the auth.js file.
We add a context function to the ApolloServer configuration that extracts the authentication token from the request headers, verifies it, and returns the userId in the context.
With these changes, you have implemented authentication and authorization for the AI recruitment platform. Users can now sign up, log in, and access protected API endpoints based on their authentication status.

We can test the authentication flow using a GraphQL client like Apollo Studio or Postman. Send a signup mutation to create a new user, then use the returned token in the Authorization header for subsequent requests to access protected endpoints.
*/