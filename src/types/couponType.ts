export interface CouponType {
  id: string;
  name: string;
  description: string;
  laborDiscountType: 'none' | 'percentage' | 'fixed';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}