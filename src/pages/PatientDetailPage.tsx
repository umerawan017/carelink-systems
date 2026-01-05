import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientDetail } from '@/components/patients/PatientDetail';
import { mockPatients, mockMedicalLogs } from '@/data/mockData';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <DashboardLayout title="Patient Not Found">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Patient Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The patient you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Patient Details"
      subtitle={`${patient.firstName} ${patient.lastName}`}
    >
      <PatientDetail patient={patient} medicalLogs={mockMedicalLogs} />
    </DashboardLayout>
  );
};

export default PatientDetailPage;
