import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, Vehicle } from '@/services/supabaseService';

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicle: Omit<Vehicle, 'id'>) => addVehicle(vehicle),
    onSuccess: () => {
      // Invalidate vehicles to refresh the data
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Vehicle> }) => updateVehicle(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', variables.id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useVehiclesWithFilters = (
  searchTerm: string,
  manufacturerFilter: string,
  serviceFilter: string,
  sortBy: string
) => {
  const { data: vehicles = [], isLoading, error } = useVehicles();

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.bikeModel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesManufacturer = manufacturerFilter === "all" || vehicle.bikeModel.includes(manufacturerFilter);

    let matchesService = true;
    if (serviceFilter === "recent") {
      const lastServiceDate = new Date(vehicle.lastService);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      matchesService = lastServiceDate >= thirtyDaysAgo;
    } else if (serviceFilter === "overdue") {
      matchesService = vehicle.status === "overdue";
    } else if (serviceFilter === "upcoming") {
      matchesService = vehicle.status === "upcoming";
    }

    return matchesSearch && matchesManufacturer && matchesService;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === "nextServiceAsc") {
      return new Date(a.nextService).getTime() - new Date(b.nextService).getTime();
    } else if (sortBy === "overduePriority") {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (b.status === "upcoming" && a.status !== "upcoming") return 1;
      return new Date(a.nextService).getTime() - new Date(b.nextService).getTime();
    } else if (sortBy === "lastServiceDesc") {
      return new Date(b.lastService).getTime() - new Date(a.lastService).getTime();
    }
    return 0;
  });

  return {
    vehicles: sortedVehicles,
    isLoading,
    error,
    totalCount: filteredVehicles.length
  };
};
