export interface UserData {
  id: string;
  email?: string;
  fullName?: string;
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    picture?: string;
    name?: string;
  };
  raw_user_meta_data?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

/**
 * Get user initials from user data
 * @param user - User data object
 * @returns User's initials (2 characters)
 */
export function getUserInitials(user: UserData | null): string {
  if (!user) return '';
  
  // Try to get from fullName first
  if (user.fullName) {
    return user.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  // Then try metadata
  const name = user.user_metadata?.name || 
              user.user_metadata?.full_name ||
              user.raw_user_meta_data?.name ||
              user.raw_user_meta_data?.full_name;
  
  if (name) {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  // Fallback to email
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return 'US';
}

/**
 * Get display name from user data
 * @param user - User data object
 * @returns Display name or fallback to 'User'
 */
export function getDisplayName(user: UserData | null): string {
  if (!user) return 'User';
  return (
    user.fullName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.raw_user_meta_data?.name ||
    user.raw_user_meta_data?.full_name ||
    user.email?.split('@')[0] ||
    'User'
  );
}

/**
 * Get avatar URL from user data
 * @param user - User data object
 * @returns Avatar URL or empty string if not available
 */
export function getAvatarUrl(user: UserData | null): string {
  if (!user) return '';
  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.raw_user_meta_data?.avatar_url ||
    user.raw_user_meta_data?.picture ||
    ''
  );
}
