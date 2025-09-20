import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';

export function useAuthentication() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/appPage');
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return {
    isLoaded,
    isSignedIn,
    user,
    isLoading,
  };
}
