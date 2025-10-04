"use client";

import { useState, useEffect } from 'react';

type UserRole = 'admin' | 'user' | null;

interface UserRoleData {
  role: UserRole;
  userId?: string;
  email?: string;
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/check-role', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          // User not authenticated
          setRole(null);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to check user role');
        }

        const data: UserRoleData = await response.json();
        setRole(data.role);
      } catch (err) {
        console.error('Error checking user role:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  return { role, loading, error };
}
