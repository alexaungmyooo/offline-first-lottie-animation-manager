// src/graphql/querys.ts
import { gql } from "@apollo/client";

export const SEARCH_ANIMATIONS = gql`
  query SearchAnimations($query: String!) {
    searchAnimations(query: $query) {
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

export const ANIMATIONS_SINCE_QUERY = `
  query AnimationsSince($lastSync: String!) {
    animationsSince(lastSync: $lastSync) {
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
