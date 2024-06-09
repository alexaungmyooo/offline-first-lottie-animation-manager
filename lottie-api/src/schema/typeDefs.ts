// src/schema/typeDefs.ts
import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Upload
  scalar JSON
  scalar DateTime

  type Animation {
    id: ID!
    title: String!
    description: String
    tags: [String!]! 
    metadata: JSON
    url: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    searchAnimations(
      query: String
      tags: [String]
    ): [Animation]
    getAnimation(id: Int!): Animation
    animationsSince(lastSync: String!): [Animation!]!
  }

  type Mutation {
    uploadAnimation(
      id: String!
      title: String!
      description: String!
      tags: [String!]!
      file: Upload!
    ): Animation
  }
`;

export default typeDefs;
