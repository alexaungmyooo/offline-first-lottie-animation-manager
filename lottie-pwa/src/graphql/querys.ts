// src/graphql/querys.ts
import { gql } from '@apollo/client';

export const SEARCH_ANIMATIONS = gql`
  query SearchAnimations($query: String!) {
    searchAnimations(query: $query) {
      id
      title
      url
    }
  }
`;