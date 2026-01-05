import { UserPlus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/button';
import { mockPatients } from '@/data/mockData';

const Patients = () => {
  return (
    <DashboardLayout
      title="Patients"
      subtitle="Manage and view all patient records"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {mockPatients.length} patients registered in the system
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>
      <PatientTable patients={mockPatients} />
    </DashboardLayout>
  );
};

export default Patients;
