import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";

// AppSync configuration
const config = {
  url: process.env.NEXT_PUBLIC_APPSYNC_GRAPHQL_ENDPOINT,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  auth: {
    type: 'API_KEY', // or 'AMAZON_COGNITO_USER_POOLS', 'AWS_IAM'
    apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
  },
};

// Initialize Apollo Client
export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: config.url,
    headers: {
      "x-api-key": config.auth.apiKey!,
    },
    fetch,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}