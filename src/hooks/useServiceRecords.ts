
import { useQuery } from '@tanstack/react-query';
import { getServiceRecords, getServiceRecordsByVehicleId } from '@/services/serviceRecordService';

export const useServiceRecords = () => {
  return useQuery({
    queryKey: ['serviceRecords'],
    queryFn: getServiceRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useServiceRecordsByVehicle = (vehicleId?: string) => {
  return useQuery({
    queryKey: ['serviceRecords', vehicleId],
    queryFn: () => vehicleId ? getServiceRecordsByVehicleId(vehicleId) : Promise.resolve([]),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
