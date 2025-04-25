
export interface TenantType {
  id: string;
  name: string;
  description: string | null;
  schoolCount: number;
  adminName: string | null;
  adminEmail: string | null;
  created_at?: string;
}

export interface TenantFormData {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}
