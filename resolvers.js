import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    company: (_, { id }) => prisma.company.findUnique({ where: { id: Number(id) } }),
    job: (_, { id }) => prisma.job.findUnique({ where: { id: Number(id) } }),
    candidate: (_, { id }) => prisma.candidate.findUnique({ where: { id: Number(id) } }),
  },
  Mutation: {
    createCompany: (_, { name, description, website }) => {
      return prisma.company.create({
        data: { name, description, website },
      });
    },
    createJob: (_, { title, description, requirements, companyId }) => {
      return prisma.job.create({
        data: {
          title,
          description,
          requirements,
          company: { connect: { id: companyId } },
        },
      });
    },
    createCandidate: (_, { name, email, resume, skills, experience }) => {
      return prisma.candidate.create({
        data: {
          name,
          email,
          resume,
          skills,
          experience: {
            create: experience,
          },
        },
      });
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
*/