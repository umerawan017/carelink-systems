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
} from 'lucide-react';
import { Patient, MedicalLog } from '@/types/patient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PatientDetailProps {
  patient: Patient;
  medicalLogs: MedicalLog[];
}

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

export function PatientDetail({ patient, medicalLogs }: PatientDetailProps) {
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

  const patientLogs = medicalLogs.filter((log) => log.patientId === patient.id);

  return (
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
              {patient.firstName} {patient.lastName}
            </h1>
            <Badge
              variant="outline"
              className={cn('capitalize', statusStyles[patient.status])}
            >
              {patient.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
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
                  <p className="font-medium text-foreground">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-foreground">{patient.address}</p>
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
                    {patient.bloodType || 'Not recorded'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy) => (
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
                  {patient.conditions.length > 0 ? (
                    patient.conditions.map((condition) => (
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
          {patient.insuranceProvider && (
            <div className="health-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Insurance
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium text-foreground">
                    {patient.insuranceProvider}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member ID</p>
                  <p className="font-medium text-foreground font-mono">
                    {patient.insuranceId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Medical Records */}
        <div className="col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              {patientLogs.length > 0 ? (
                patientLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="health-card animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          logTypeStyles[log.type]
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
                              {log.providerName} • {formatDate(log.date)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-foreground mt-3">{log.description}</p>
                        {log.vitals && (
                          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                            {log.vitals.bloodPressure && (
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-destructive" />
                                <span className="text-sm">
                                  <span className="text-muted-foreground">BP:</span>{' '}
                                  <span className="font-medium">{log.vitals.bloodPressure}</span>
                                </span>
                              </div>
                            )}
                            {log.vitals.heartRate && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                  <span className="text-muted-foreground">HR:</span>{' '}
                                  <span className="font-medium">{log.vitals.heartRate} bpm</span>
                                </span>
                              </div>
                            )}
                            {log.vitals.temperature && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Temp:</span>{' '}
                                <span className="font-medium">{log.vitals.temperature}°F</span>
                              </div>
                            )}
                            {log.vitals.weight && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Weight:</span>{' '}
                                <span className="font-medium">{log.vitals.weight} lbs</span>
                              </div>
                            )}
                          </div>
                        )}
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

            <TabsContent value="vitals">
              <div className="health-card text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">Vitals Chart</h3>
                <p className="text-muted-foreground mt-1">
                  Vitals history and trends will be displayed here.
                </p>
              </div>
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
  );
}
