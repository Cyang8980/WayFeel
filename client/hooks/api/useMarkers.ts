// hooks/api/useMarkers.ts
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MARKERS, GET_MARKER } from '@/lib/graphql/queries/markers';
import { CREATE_MARKER } from '@/lib/graphql/mutations/createMarkers';
import type { Marker, MarkerFilterInput } from '@/lib/graphql/types';

export function useMarkers(options?: MarkerFilterInput) {
  return useQuery(GET_MARKERS, {
    variables: { options },
    fetchPolicy: 'cache-and-network',
  });
}

export function useMarker(id: string) {
  return useQuery(GET_MARKER, {
    variables: { id },
    skip: !id,
  });
}

export function useCreateMarker() {
  const [createMarker, { loading, error }] = useMutation(CREATE_MARKER, {
    update(cache : any, { data: { createMarker } }: any) {
      cache.modify({
        fields: {
          getMarkers(existingMarkers = []) {
            return [...existingMarkers, createMarker];
          },
        },
      });
    },
  });

  return {
    createMarker: (marker: Omit<Marker, 'id' | 'created_at'>) => 
      createMarker({ variables: { marker } }),
    loading,
    error,
  };
}