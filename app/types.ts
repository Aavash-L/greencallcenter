export type Product = "Roof" | "Siding" | "Windows" | "Doors";
export type VerificationStatus = "Verified" | "Flagged" | "Pending";

export interface VerificationBadges {
  number: boolean;
  gps: boolean;
  recording: boolean;
}

export interface AuditEntry {
  time: string;
  event: string;
}

export interface SetRecord {
  id: string;
  repName: string;
  homeownerName: string;
  phone: string;
  address: string;
  apptDate: string;
  apptTime: string;
  product: Product;
  notes: string;
  submittedAt: string;
  status: VerificationStatus;
  badges: VerificationBadges;
  gpsMismatch: boolean;
  auditTrail: AuditEntry[];
}
