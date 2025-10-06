"use client";

import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'user';
}

interface UserHookReturn {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export function useUser(): UserHookReturn {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/check-role', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          // User not authenticated
          setUser(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }

        const data = await response.json();
        setUser({
          id: data.userId,
          email: data.email,
          role: data.role,
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, loading, error };
}
