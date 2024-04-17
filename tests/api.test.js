import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

describe('API Integration Tests', () => {
  it('should create a new company', async () => {
    const { mutate } = createTestClient(server);

    const CREATE_COMPANY_MUTATION = `
      mutation {
        createCompany(name: "Test Company", description: "Test Description") {
          id
          name
          description
        }
      }
    `;

    const response = await mutate({ mutation: CREATE_COMPANY_MUTATION });

    expect(response.data.createCompany.name).toBe('Test Company');
    expect(response.data.createCompany.description).toBe('Test Description');
  });

  // Add more integration tests for other API endpoints...
});

/*
We import the createTestClient function from apollo-server-testing to create a test client for the Apollo Server.
We import the ApolloServer, typeDefs, and resolvers to set up the server for testing.
We create a new instance of the ApolloServer with the typeDefs and resolvers.
We define an integration test case for creating a new company using the createCompany mutation.
We use the createTestClient function to create a test client and send a mutation request to create a new company.
We assert that the response contains the expected company data.
*/