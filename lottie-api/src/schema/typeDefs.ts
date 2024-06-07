// src/schema/typeDefs.ts
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Upload

  type Animation {
    id: Int!
    title: String!
    description: String!
    metadata: String!
    url: String!
    duration: Int!
    category: String!
    tags: [String!]!
    createdAt: String!
  }

  type Query {
    searchAnimations(query: String, category: String, tags: [String]): [Animation]
    getAnimation(id: Int!): Animation
    downloadAnimation(id: Int!): String
  }

  type Mutation {
    uploadAnimation(
      title: String!, 
      description: String!, 
      tags: [String!]!, 
      metadata: String!, 
      file: Upload!, 
      duration: Int!, 
      category: String!
    ): Animation
  }
`;

export default typeDefs;
