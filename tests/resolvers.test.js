import { resolvers } from '../resolvers';
import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  company: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  job: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  candidate: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

describe('Resolvers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve companies with pagination and filtering', async () => {
    const companies = [{ id: 1, name: 'Company 1' }, { id: 2, name: 'Company 2' }];
    mockPrisma.company.findMany.mockResolvedValue(companies);

    const result = await resolvers.Query.companies(null, { skip: 0, limit: 10, name: 'Company' });

    expect(mockPrisma.company.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: { name: { contains: 'Company' } },
    });
    expect(result).toEqual(companies);
  });

  // Add more unit tests for other resolvers...
});



/*
We import the resolvers from the resolvers.js file and the PrismaClient from @prisma/client.
We create a mock mockPrisma object that mocks the Prisma client methods used in the resolvers.
We use jest.mock to replace the actual PrismaClient with the mock implementation.
We define a test case for the companies query resolver to verify that it retrieves companies with pagination and filtering.
We mock the findMany method of the company model to return a predefined set of companies.
We call the companies resolver with specific arguments and assert that the findMany method is called with the expected arguments 
and that the result matches the mocked companies.
*/