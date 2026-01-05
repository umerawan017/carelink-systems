-- Create profiles table for healthcare providers
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  specialty TEXT,
  role TEXT DEFAULT 'provider' CHECK (role IN ('provider', 'admin', 'nurse')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  email TEXT,
  phone TEXT,
  address TEXT,
  insurance_provider TEXT,
  insurance_id TEXT,
  blood_type TEXT,
  allergies TEXT[] DEFAULT '{}',
  conditions TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'critical')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  type TEXT CHECK (type IN ('checkup', 'follow-up', 'consultation', 'procedure', 'emergency')) DEFAULT 'checkup',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medical_logs table
CREATE TABLE public.medical_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('visit', 'lab', 'prescription', 'procedure', 'note')) DEFAULT 'visit',
  title TEXT NOT NULL,
  description TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vitals table for charting
CREATE TABLE public.vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(4,1),
  weight DECIMAL(5,1),
  height DECIMAL(5,1),
  oxygen_saturation INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Patients policies (authenticated healthcare providers can manage all patients)
CREATE POLICY "Authenticated users can view all patients" ON public.patients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create patients" ON public.patients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients" ON public.patients
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete patients" ON public.patients
  FOR DELETE TO authenticated USING (true);

-- Appointments policies
CREATE POLICY "Authenticated users can view all appointments" ON public.appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete appointments" ON public.appointments
  FOR DELETE TO authenticated USING (true);

-- Medical logs policies
CREATE POLICY "Authenticated users can view all medical logs" ON public.medical_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create medical logs" ON public.medical_logs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update medical logs" ON public.medical_logs
  FOR UPDATE TO authenticated USING (true);

-- Vitals policies
CREATE POLICY "Authenticated users can view all vitals" ON public.vitals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create vitals" ON public.vitals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update vitals" ON public.vitals
  FOR UPDATE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Create indexes for better performance
CREATE INDEX idx_patients_status ON public.patients(status);
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_appointments_provider ON public.appointments(provider_id);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_vitals_patient ON public.vitals(patient_id);
CREATE INDEX idx_vitals_recorded_at ON public.vitals(recorded_at);
CREATE INDEX idx_medical_logs_patient ON public.medical_logs(patient_id);