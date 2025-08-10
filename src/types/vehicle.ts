
export interface Vehicle {
  id: string;
  type: 'bike' | 'car';
  bikeModel?: string;
  carModel?: string;
  year: number;
  engineCapacity: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: string;
  lastServiceKilometers: number;
  currentKilometers: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
