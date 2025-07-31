import { useQuery } from '@tanstack/react-query';
import { getProfiles, getCurrentUserProfile } from '@/services/profileService';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: getProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: getCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};