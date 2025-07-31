
// Re-export everything from the separate service files for backward compatibility
export * from "./vehicleService";
export * from "./serviceRecordService";
export * from "./callRecordService";
export * from "./couponTypeService";
export * from "./profileService";
export * from "./serviceTypeService";

// Re-export types
export type { Vehicle } from "@/types/vehicle";
export type { ServiceRecord, Part } from "@/types/serviceRecord";
export type { CallRecord } from "@/types/callRecord";
export type { CouponType } from "@/types/couponType";
export type { Profile } from "./profileService";
export type { ServiceType } from "@/types/serviceType";
