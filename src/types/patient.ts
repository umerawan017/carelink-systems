export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  insuranceProvider?: string;
  insuranceId?: string;
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  status: 'active' | 'inactive' | 'critical';
  lastVisit?: string;
  nextAppointment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  duration: number;
  type: 'checkup' | 'follow-up' | 'consultation' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface MedicalLog {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  date: string;
  type: 'visit' | 'lab' | 'prescription' | 'procedure' | 'note';
  title: string;
  description: string;
  attachments?: string[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  createdAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  pendingFollowUps: number;
  criticalCases: number;
  monthlyVisits: number;
}
