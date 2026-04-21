import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'user';
}

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminRole() {
      if (authLoading) return;
      
      if (!user) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setError('Failed to fetch user profile');
          setAdminUser(null);
          return;
        }

        if (userProfile && ['super_admin', 'admin'].includes(userProfile.role)) {
          setAdminUser({
            id: user.id,
            email: user.email || '',
            full_name: userProfile.full_name || user.email || '',
            role: userProfile.role as 'super_admin' | 'admin'
          });
        } else {
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Error in checkAdminRole:', err);
        setError('An error occurred while checking admin role');
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAdminRole();
  }, [user, authLoading]);

  const isSuperAdmin = adminUser?.role === 'super_admin';
  const isAdmin = adminUser?.role === 'admin' || isSuperAdmin;

  return {
    adminUser,
    loading,
    error,
    isSuperAdmin,
    isAdmin,
    isAuthenticated: !!adminUser
  };
}

export function useAdminAPI() {
  const { user } = useAuth();

  const callAdminAPI = async (endpoint: string, options: RequestInit = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(
      `https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/property_management_complete_2026_03_04_10_00/${endpoint}`,
      {
        ...options,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  return { callAdminAPI };
}