
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCallRecords, upsertCallRecord } from '@/services/callRecordService';

export const useCallRecords = () => {
  return useQuery({
    queryKey: ['callRecords'],
    queryFn: getCallRecords,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for call tracking)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateCallRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, called, notes }: { vehicleId: string; called: boolean; notes?: string }) =>
      upsertCallRecord(vehicleId, called, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callRecords'] });
    },
  });
};
