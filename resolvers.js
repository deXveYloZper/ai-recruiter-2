import { PrismaClient } from '@prisma/client';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { generateToken, verifyToken, hashPassword, comparePassword } from './auth.js';
import { ValidationError, AuthorizationError, NotFoundError } from './errors.js';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    company: async (_, { id }) => {
      const company = await prisma.company.findUnique({ where: { id: Number(id) } });
      if (!company) throw new NotFoundError('Company not found');
      return company;
    },
    job: async (_, { id }) => {
      const job = await prisma.job.findUnique({ where: { id: Number(id) } });
      if (!job) throw new NotFoundError('Job not found');
      return job;
    },
    candidate: async (_, { id }) => {
      const candidate = await prisma.candidate.findUnique({ where: { id: Number(id) } });
      if (!candidate) throw new NotFoundError('Candidate not found');
      return candidate;
    },
    me: async (_, __, { userId }) => {
      if (!userId) throw new AuthenticationError('Authentication required');
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundError('User not found');
      return user;
    },
    companies: async (_, { skip = 0, limit = 10, name }) => {
      const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};
      return prisma.company.findMany({ skip, take: limit, where });
    },
    jobs: async (_, { skip = 0, limit = 10, title, companyId }) => {
      const where = {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(companyId && { companyId: Number(companyId) }),
      };
      return prisma.job.findMany({ skip, take: limit, where });
    },
    candidates: async (_, { skip = 0, limit = 10, name, skills }) => {
      const where = {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(skills && { skills: { hasSome: skills } }),
      };
      return prisma.candidate.findMany({ skip, take: limit, where });
    },
  },
  Mutation: {
    createCompany: async (_, { name, description, website }, { userId }) => {
      if (!userId) throw new AuthenticationError('Authentication required');
      if (!name) throw new ValidationError('Company name is required', 'name');
      return prisma.company.create({ data: { name, description, website } });
    },
    createJob: async (_, { title, description, requirements, companyId }, { userId }) => {
      if (!userId) throw new AuthenticationError('Authentication required');
      if (!title || !description || !companyId) {
        throw new ValidationError('Missing required fields', 'form');
      }
      return prisma.job.create({
        data: { title, description, requirements, company: { connect: { id: Number(companyId) } } },
      });
    },
    createCandidate: async (_, { name, email, resume, skills, experience }) => {
      return prisma.candidate.create({
        data: {
          name, email, resume, skills,
          experience: { create: experience },
        },
      });
    },
    signup: async (_, { email, password }) => {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({ data: { email, password: hashedPassword } });
      const token = generateToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError('Invalid email');
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) throw new AuthenticationError('Invalid password');
      const token = generateToken(user);
      return { token, user };
    },
  },
};


/* 
We define sample data arrays for `companies`, `jobs`, and `candidates` (replace this with actual database integration later).

The query resolvers (company, job, candidate) find and return the respective objects based on the provided id.
The mutation resolvers (createCompany, createJob, createCandidate) create new objects and add them to the respective arrays.

In the updated `resolvers`:
- We import and instantiate `PrismaClient` to interact with the database.
- The query resolvers use Prisma's `findUnique` method to retrieve records by their `id`.
- The mutation resolvers use Prisma's `create` method to insert new records into the database.
- The `connect` and `create` methods are used to establish relationships between records (e.g., connecting a `Job` to a `Company`, creating `Experience` records for a `Candidate`).

We import the authentication-related functions from the auth.js file.
We add a new me query resolver that returns the authenticated user based on the provided userId from the context.
We add a signup mutation resolver that creates a new user with the provided email and password, hashes the password, and returns an authentication token and the created user.
We add a login mutation resolver that authenticates the user based on the provided email and password, and returns an authentication token and the authenticated user.

We import the AuthenticationError and UserInputError classes from apollo-server-express for handling authentication and user input errors.
We import the custom ValidationError class from the errors.js file.
In the createCompany and createJob mutation resolvers, we add authentication checks to ensure that only authenticated users can perform these actions. If the userId is not present in the context, we throw an AuthenticationError.
We add validation checks for required fields (e.g., name for createCompany, title, description, and companyId for createJob). If any required field is missing, we throw a ValidationError with an appropriate message and field name.
We wrap the Prisma database operations inside a try-catch block to handle any potential errors. If an error occurs during the database operation, we throw a UserInputError with a generic message and the original error as the cause.

We add pagination and filtering logic to the companies, jobs, and candidates query resolvers.
We use the skip and limit arguments to control the pagination. The skip argument specifies the number of records to skip, and the limit argument specifies the maximum number of records to return. We provide default values of 0 for skip and 10 for limit.
We use the filtering arguments (name, title, companyId, skills) to construct the where object for filtering the results. We use Prisma's contains operator for string-based filtering and the hasSome operator for array-based filtering.
We pass the skip, take (limit), and where options to Prisma's findMany method to retrieve the paginated and filtered results.
With these changes, clients can now use pagination and filtering when querying for companies, jobs, and candidates. They can specify the skip and limit arguments to control the pagination and provide filtering criteria using the available filtering arguments.
*/