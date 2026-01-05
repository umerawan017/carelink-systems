import { CalendarPlus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AppointmentsList } from '@/components/dashboard/AppointmentsList';
import { mockAppointments } from '@/data/mockData';

const Appointments = () => {
  return (
    <DashboardLayout
      title="Appointments"
      subtitle="Manage and schedule patient appointments"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {mockAppointments.length} appointments scheduled
          </p>
        </div>
        <Button className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>
      <AppointmentsList appointments={mockAppointments} />
    </DashboardLayout>
  );
};

export default Appointments;
