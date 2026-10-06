export interface HealthCheckData {
  status: "operational" | "degraded";
  environment: string;
  timestamp: string;
  services: {
    database: { status: string; error: string | null };
    cache: { status: string; driver: string; error: string | null };
  };
  php_version: string;
  framework: string;
}

export interface EmployeeProfile {
  id: number;
  name: string;
  employee_id: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  company: string;
  joining_date: string;
  blood_group: string;
  salary: {
    basic: number;
    house_rent: number;
    medical: number;
    gross: number;
  };
  bank_details: {
    bank_name: string;
    account_number: string;
    branch: string;
    routing_number: string;
  };
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface LoginResponseData {
  token: string;
  user: EmployeeProfile;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface SendVerificationCodeResponse {
  status: boolean;
  message: string;
  email: string;
  dev_code?: string;
  expires_in_minutes: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  status: boolean;
  verified: boolean;
  message: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  code: string;
  department?: string;
  designation?: string;
  phone?: string;
}

export interface RegisterUserResponse {
  status: boolean;
  token: string;
  message: string;
  company_id: number;
  user_id: number;
  employee_id: number;
  employee_full_id: string;
  employee_name: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone_number: string;
  is_active: boolean;
  email_verified: boolean;
}

