// src/graphql/mutations.ts
import { gql } from '@apollo/client';

export const UPLOAD_ANIMATION = gql`
  mutation UploadAnimation($title: String!, $description: String!, $tags: [String!]!, $metadata: String!, $file: Upload!, $duration: Int!, $category: String!) {
    uploadAnimation(title: $title, description: $description, tags: $tags, metadata: $metadata, file: $file, duration: $duration, category: $category) {
      id
      title
      url
    }
  }
`;

