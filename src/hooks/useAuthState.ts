
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth.types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state');
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile on auth state change
          // Using setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(async () => {
            try {
              // First get the user's role and basic info
              const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching user profile:', error);
                return;
              }
              
              if (profile) {
                let tenantId = profile.tenant_id;
                
                // If no tenant_id but user is tenant_admin, try to find their tenant
                if (!tenantId && profile.role === 'tenant_admin') {
                  console.log('Tenant admin found but no tenant ID, looking for tenant');
                  
                  const { data: tenantData, error: tenantError } = await supabase
                    .from('tenants')
                    .select('id')
                    .eq('admin_id', session.user.id)
                    .maybeSingle();
                  
                  if (tenantError) {
                    console.error('Error fetching tenant:', tenantError);
                  } else if (tenantData) {
                    console.log('Found tenant for admin:', tenantData.id);
                    tenantId = tenantData.id;
                    
                    // Update the user record with the found tenant_id
                    const { error: updateError } = await supabase
                      .from('users')
                      .update({ tenant_id: tenantId })
                      .eq('id', session.user.id);
                    
                    if (updateError) {
                      console.error('Error updating user with tenant_id:', updateError);
                    } else {
                      console.log('Updated user with tenant_id:', tenantId);
                    }
                  }
                }
                
                // Set user with profile data
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile.name || '',
                  role: profile.role,
                  tenantId: tenantId,
                  schoolId: profile.school_id
                });
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Checking for existing session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          // Get user profile
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            let tenantId = profile.tenant_id;
            
            // If no tenant_id but user is tenant_admin, try to find their tenant
            if (!tenantId && profile.role === 'tenant_admin') {
              console.log('Tenant admin found but no tenant ID, looking for tenant');
              
              const { data: tenantData, error: tenantError } = await supabase
                .from('tenants')
                .select('id')
                .eq('admin_id', session.user.id)
                .maybeSingle();
              
              if (tenantError) {
                console.error('Error fetching tenant:', tenantError);
              } else if (tenantData) {
                console.log('Found tenant for admin:', tenantData.id);
                tenantId = tenantData.id;
                
                // Update the user record with the found tenant_id
                const { error: updateError } = await supabase
                  .from('users')
                  .update({ tenant_id: tenantId })
                  .eq('id', session.user.id);
                
                if (updateError) {
                  console.error('Error updating user with tenant_id:', updateError);
                } else {
                  console.log('Updated user with tenant_id:', tenantId);
                }
              }
            }
            
            // Set user with profile data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || '',
              role: profile.role,
              tenantId: tenantId,
              schoolId: profile.school_id
            });
          }
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isLoading, setUser, setIsLoading };
};
