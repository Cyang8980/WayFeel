'use client';

import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/lib/graphql/client';

export function WayfeelApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}