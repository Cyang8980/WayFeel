'use client';

import { useQuery } from '@apollo/client/react';
import { TEST_QUERY } from '@/lib/graphql/queries/testQuery';
import { GET_MARKERS } from '@/lib/graphql/queries/getMarkers';


export function TestApollo() {
    const { loading, error, data } = useQuery(GET_MARKERS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-bold mb-2">Apollo Client Test</h2>
            <p>Query successful! Server returned:</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}