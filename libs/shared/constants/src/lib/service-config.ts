// Service Names
export const SERVICES = {
  AUTH_SERVICE: 'AUTH_SERVICE',
  PATIENT_SERVICE: 'PATIENT_SERVICE',
} as const;

// Service Ports
export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  PATIENT_SERVICE: 3001,
  AUTH_SERVICE: 8081,
} as const;

// Message Patterns for Microservice Communication
export const MESSAGE_PATTERNS = {
  // Auth patterns
  AUTH_LOGIN: { cmd: 'auth.login' },
  AUTH_REGISTER: { cmd: 'auth.register' },
  AUTH_VERIFY_TOKEN: { cmd: 'auth.verifyToken' },

  // Patient patterns
  PATIENT_CREATE: { cmd: 'patient.create' },
  PATIENT_FIND_BY_ID: { cmd: 'patient.findById' },
  PATIENT_FIND_ALL: { cmd: 'patient.findAll' },
  PATIENT_UPDATE: { cmd: 'patient.update' },
} as const;

// Account Roles
export enum AccountRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT',
}

// Appointment Status (for future use)
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Payment Status (for future use)
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}
