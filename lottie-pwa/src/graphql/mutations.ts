import { gql } from '@apollo/client';

export const UPLOAD_ANIMATION = gql`
  mutation UploadAnimation(
    $id: String!, 
    $title: String!, 
    $description: String!, 
    $tags: [String!]!, 
    $file: Upload!,
  ) {
    uploadAnimation(
      id: $id, 
      title: $title, 
      description: $description, 
      tags: $tags, 
      file: $file, 
    ) {
      id
      title
      description
      metadata
      url
      tags
      createdAt
      updatedAt
    }
  }
`;

export const UPLOAD_ANIMATION_QUERY = `
  mutation UploadAnimation(
    $id: String!, 
    $title: String!, 
    $description: String!, 
    $tags: [String!]!,
    $file: Upload!,
  ) {
    uploadAnimation(
      id: $id, 
      title: $title, 
      description: $description, 
      tags: $tags, 
      file: $file, 
    ) {
      id
      title
      description
      metadata
      url
      tags
      createdAt
      updatedAt
    }
  }
`;
