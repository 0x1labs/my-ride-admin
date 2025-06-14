
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
  variant?: string;
}
