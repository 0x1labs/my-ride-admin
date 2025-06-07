import vehiclesData from '../data/vehicles.json';

export interface Vehicle {
  id: string;
  type: "car" | "bike";
  make: string;
  model: string;
  year: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: "active" | "overdue" | "upcoming";
  lastServiceKilometers: number;
  currentKilometers: number;
}

export interface Part {
  name: string;
  cost: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  parts: Array<Part>;
  laborCost: number;
  discount: number;
  technician: string;
  notes: string;
  hasCoupon: boolean;
  couponType: string | null;
  kilometers: number;
}

export interface CallRecord {
  vehicleId: string;
  called: boolean;
  callDate?: string;
}

// Sample service records
const serviceRecords: ServiceRecord[] = [
  {
    id: "SRV001",
    vehicleId: "VIN001",
    date: "2024-05-15",
    type: "Regular Maintenance",
    parts: [
      { name: "Engine Oil", cost: 35.00 },
      { name: "Oil Filter", cost: 15.00 },
      { name: "Air Filter", cost: 25.00 }
    ],
    laborCost: 45.00,
    discount: 10.00,
    technician: "Mike Wilson",
    notes: "Routine maintenance completed. Next service due in 6 months.",
    hasCoupon: true,
    couponType: "Annual Maintenance Contract",
    kilometers: 45000
  },
  {
    id: "SRV002",
    vehicleId: "VIN001",
    date: "2024-02-20",
    type: "Brake Service",
    parts: [
      { name: "Brake Pads", cost: 85.00 },
      { name: "Brake Fluid", cost: 20.00 }
    ],
    laborCost: 145.00,
    discount: 0.00,
    technician: "Sarah Johnson",
    notes: "Replaced worn brake pads. Brake system functioning properly.",
    hasCoupon: false,
    couponType: null,
    kilometers: 42000
  },
  {
    id: "SRV003",
    vehicleId: "VIN002",
    date: "2024-03-20",
    type: "Chain Maintenance",
    parts: [
      { name: "Chain", cost: 45.00 },
      { name: "Chain Oil", cost: 12.00 },
      { name: "Sprockets", cost: 28.00 }
    ],
    laborCost: 40.00,
    discount: 5.00,
    technician: "Tom Brown",
    notes: "Chain and sprockets replaced. Lubrication service completed.",
    hasCoupon: true,
    couponType: "Loyalty Discount",
    kilometers: 12000
  }
];

export const getVehicles = (): Vehicle[] => {
  return vehiclesData as Vehicle[];
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehiclesData.find(vehicle => vehicle.id === id) as Vehicle | undefined;
};

export const getServiceRecords = (): ServiceRecord[] => {
  return serviceRecords;
};

export const getServiceRecordsByVehicleId = (vehicleId: string): ServiceRecord[] => {
  return serviceRecords.filter(record => record.vehicleId === vehicleId);
};

export const addServiceRecord = (record: Omit<ServiceRecord, 'id'>): ServiceRecord => {
  const newRecord: ServiceRecord = {
    ...record,
    id: `SRV${String(serviceRecords.length + 1).padStart(3, '0')}`
  };
  serviceRecords.push(newRecord);
  return newRecord;
};
