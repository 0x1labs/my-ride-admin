
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
