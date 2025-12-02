// hooks/api/useUsers.ts
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

// Define your GraphQL operations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      # Add other user fields you need
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      # Add other user fields you need
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      # Return updated fields
    }
  }
`;

// User type (you might want to move this to a types file)
export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties
}

export function useUsers() {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
  };
}

export function useUser(id: string) {
  const { data, loading, error, refetch } = useQuery<{ user: User }>(GET_USER, {
    variables: { id },
    skip: !id,
  });

  return {
    user: data?.user,
    loading,
    error,
    refetch,
  };
}

export function useUpdateUser() {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER, {
    // Optional: Update cache after mutation
    update(cache : any, { data: { updateUser } }: any) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            return existingUsers.map((user: any) => 
              user.id === updateUser.id ? updateUser : user
            );
          },
        },
      });
    },
  });

  return {
    updateUser: (id: string, updates: Partial<User>) => 
      updateUser({ variables: { id, input: updates } }),
    loading,
    error,
  };
}