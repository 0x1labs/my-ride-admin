import { useQuery } from '@tanstack/react-query';
import { getServiceTypes } from '@/services/serviceTypeService';

export const useServiceTypes = () => {
  return useQuery({
    queryKey: ['serviceTypes'],
    queryFn: getServiceTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};