// src/graphql/mutations.ts
import { gql } from '@apollo/client';

export const UPLOAD_ANIMATION = gql`
  mutation UploadAnimation($id: String!, $title: String!, $description: String!, $tags: [String!]!, $metadata: String!, $file: Upload!, $duration: Int!, $category: String!) {
    uploadAnimation(id: $id, title: $title, description: $description, tags: $tags, metadata: $metadata, file: $file, duration: $duration, category: $category) {
      id
      title
      description
      metadata
      url
      duration
      category
      tags
      createdAt
      updatedAt
    }
  }
`;


export const UPLOAD_ANIMATION_QUERY = `
  mutation UploadAnimation($id: String!, $title: String!, $description: String!, $tags: [String!]!, $metadata: String!, $file: Upload!, $duration: Int!, $category: String!) {
    uploadAnimation(id: $id, title: $title, description: $description, tags: $tags, metadata: $metadata, file: $file, duration: $duration, category: $category) {
      id
      title
      description
      metadata
      url
      duration
      category
      tags
      createdAt
      updatedAt
    }
  }
`;