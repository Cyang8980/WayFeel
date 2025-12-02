// lib/graphql/mutations/createMarker.ts
import { gql } from '@apollo/client';

export const CREATE_MARKER = gql`
  mutation CreateMarker($marker: CreateMarkerInput!) {
    createMarker(marker: $marker) {
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