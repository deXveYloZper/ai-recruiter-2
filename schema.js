import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Company {
    id: ID!
    name: String!
    description: String
    website: String
    jobs: [Job!]!
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    requirements: [String!]!
    company: Company!
  }

  type Candidate {
    id: ID!
    name: String!
    email: String!
    resume: String
    skills: [String!]!
    experience: [Experience!]!
  }

  type Experience {
    id: ID!
    title: String!
    company: String!
    startDate: String!
    endDate: String
  }

  type User {
    id: ID!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    company(id: ID!): Company
    job(id: ID!): Job
    candidate(id: ID!): Candidate
    me: User
    companies(skip: Int, limit: Int, name: String): [Company!]!
    jobs(skip: Int, limit: Int, title: String, companyId: Int): [Job!]!
    candidates(skip: Int, limit: Int, name: String, skills: [String!]): [Candidate!]!
  }

  type Mutation {
    createCompany(name: String!, description: String, website: String): Company!
    createJob(title: String!, description: String!, requirements: [String!]!, companyId: ID!): Job!
    createCandidate(name: String!, email: String!, resume: String, skills: [String!]!, experience: [Experience!]!): Candidate!
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

  }
`;

/*
We define types for Company, Job, Candidate, and Experience.
The Company type has fields for id, name, description, website, and a list of associated jobs.
The Job type has fields for id, title, description, requirements, and the associated company.
The Candidate type has fields for id, name, email, resume, skills, and a list of experience.
The Experience type represents a candidate's work experience, with fields for id, title, company, startDate, and endDate.
We define query types for fetching a single company, job, and candidate by their respective id.
We define mutation types for creating a new company, job, and candidate.

We add pagination arguments skip and limit to the companies, jobs, and candidates queries. skip specifies the number of records to skip, and limit specifies the maximum number of records to return.
We add filtering arguments name to the companies query, title and companyId to the jobs query, and name and skills to the candidates query. These arguments allow clients to filter the results based on specific criteria.
*/