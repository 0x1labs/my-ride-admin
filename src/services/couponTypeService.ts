import { supabase } from "@/integrations/supabase/client";
import { CouponType } from "@/types/couponType";

// Helper function to transform database row to CouponType interface
const transformCouponType = (row: any): CouponType => {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    laborDiscountType: row.labor_discount_type,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const getCouponTypes = async (): Promise<CouponType[]> => {
  console.log('Fetching coupon types from Supabase...');
  
  const { data, error } = await supabase
    .from('coupon_types')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching coupon types:', error);
    throw error;
  }

  console.log('Coupon types fetched successfully:', data?.length);
  return data?.map(transformCouponType) || [];
};