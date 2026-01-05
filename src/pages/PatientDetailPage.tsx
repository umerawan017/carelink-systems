import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Heart,
  Droplets,
  FileText,
  Clock,
  Edit,
  MoreHorizontal,
  Activity,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VitalsChart } from '@/components/vitals/VitalsChart';
import { AddVitalsDialog } from '@/components/vitals/AddVitalsDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const logTypeStyles = {
  visit: 'bg-primary/10 text-primary',
  lab: 'bg-info/10 text-info',
  prescription: 'bg-success/10 text-success',
  procedure: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
};

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [medicalLogs, setMedicalLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVitals, setShowAddVitals] = useState(false);
  const [refreshVitals, setRefreshVitals] = useState(0);
  const { user } = useAuth();

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching patient:', error);
    } else {
      setPatient(data);
    }
  }, [id]);

  const fetchMedicalLogs = useCallback(async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from('medical_logs')
      .select(`
        *,
        profiles:provider_id (
          first_name,
          last_name
        )
      `)
      .eq('patient_id', id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching medical logs:', error);
    } else {
      setMedicalLogs(data || []);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchPatient();
    fetchMedicalLogs();
  }, [fetchPatient, fetchMedicalLogs]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout title="Patient Not Found">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Patient Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The patient you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/patients">
              <Button className="mt-4">Back to Patients</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Patient Details"
      subtitle={`${patient.first_name} ${patient.last_name}`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/patients">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {patient.first_name} {patient.last_name}
              </h1>
              <Badge
                variant="outline"
                className={cn('capitalize', statusStyles[patient.status as keyof typeof statusStyles])}
              >
                {patient.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {calculateAge(patient.date_of_birth)} years old • {patient.gender}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Patient
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="health-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{patient.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{patient.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{patient.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="health-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Medical Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                    <Droplets className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="font-medium text-foreground">
                      {patient.blood_type || 'Not recorded'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy: string) => (
                        <Badge
                          key={allergy}
                          variant="outline"
                          className="bg-destructive/10 text-destructive border-destructive/20"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No known allergies</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions && patient.conditions.length > 0 ? (
                      patient.conditions.map((condition: string) => (
                        <Badge key={condition} variant="secondary">
                          {condition}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No active conditions</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance */}
            {patient.insurance_provider && (
              <div className="health-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Insurance
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium text-foreground">
                      {patient.insurance_provider}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member ID</p>
                    <p className="font-medium text-foreground font-mono">
                      {patient.insurance_id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Medical Records */}
          <div className="col-span-2">
            <Tabs defaultValue="vitals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="vitals">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => setShowAddVitals(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Record Vitals
                  </Button>
                </div>
                <VitalsChart patientId={patient.id} key={refreshVitals} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                {medicalLogs.length > 0 ? (
                  medicalLogs.map((log, index) => (
                    <div
                      key={log.id}
                      className="health-card animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            logTypeStyles[log.type as keyof typeof logTypeStyles]
                          )}
                        >
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">
                                  {log.title}
                                </h4>
                                <Badge variant="outline" className="capitalize text-xs">
                                  {log.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {log.profiles?.first_name} {log.profiles?.last_name} • {formatDate(log.date)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-foreground mt-3">{log.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="health-card text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No Records Yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Medical records will appear here when added.
                    </p>
                    <Button className="mt-4">Add Medical Record</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents">
                <div className="health-card text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Documents</h3>
                  <p className="text-muted-foreground mt-1">
                    Uploaded documents and files will appear here.
                  </p>
                  <Button variant="outline" className="mt-4">Upload Document</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AddVitalsDialog
        open={showAddVitals}
        onOpenChange={setShowAddVitals}
        patientId={patient.id}
        onSuccess={() => setRefreshVitals((r) => r + 1)}
      />
    </DashboardLayout>
  );
};

export default PatientDetailPage;
