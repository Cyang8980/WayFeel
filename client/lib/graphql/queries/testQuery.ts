import { gql } from '@apollo/client';

export const TEST_QUERY = gql`
  query TestQuery {
    __typename  # This is a valid query that works with any GraphQL API
  }
`;