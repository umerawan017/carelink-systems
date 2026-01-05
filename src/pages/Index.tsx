import { Users, Calendar, AlertCircle, Activity, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentsList } from '@/components/dashboard/AppointmentsList';
import { RecentPatients } from '@/components/dashboard/RecentPatients';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockStats, mockAppointments, mockPatients } from '@/data/mockData';

const Index = () => {
  const todayAppointments = mockAppointments.filter(
    (apt) => apt.date === '2024-01-12'
  );

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back, Dr. Foster"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={mockStats.totalPatients.toLocaleString()}
          icon={Users}
          change={{ value: 12, type: 'increase' }}
          variant="primary"
        />
        <StatCard
          title="Active Patients"
          value={mockStats.activePatients.toLocaleString()}
          icon={Activity}
          variant="success"
        />
        <StatCard
          title="Today's Appointments"
          value={mockStats.todayAppointments}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Pending Follow-ups"
          value={mockStats.pendingFollowUps}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Critical Cases"
          value={mockStats.criticalCases}
          icon={AlertCircle}
          variant="destructive"
        />
        <StatCard
          title="Monthly Visits"
          value={mockStats.monthlyVisits}
          icon={TrendingUp}
          change={{ value: 8, type: 'increase' }}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AppointmentsList appointments={todayAppointments} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <RecentPatients patients={mockPatients} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
