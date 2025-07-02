import { User } from '@supabase/supabase-js';

export function isAdmin(user: User | null): boolean {
  if (!user) {
    return false;
  }
  // Check for admin role in app_metadata
  if (user.app_metadata && user.app_metadata.roles && user.app_metadata.roles.includes('admin')) {
    return true;
  }
  // Fallback to checking the email against the environment variable
  return user.email === process.env.ADMIN_EMAIL;
}
