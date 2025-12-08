// lib/graphql/queries/getMarkers.ts
import { gql } from '@apollo/client';

export const GET_MARKERS = gql`
  query GetMarkers($options: MarkerFilterInput) {
    getMarkers(options: $options) {
      id
      created_at
      end_at
      longitude
      latitude
      created_by
      text
      emoji_id
      anon
    }
  }
`;