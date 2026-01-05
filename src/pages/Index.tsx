import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, AlertCircle, Activity, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusStyles = {
  scheduled: 'bg-info/10 text-info border-info/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const patientStatusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Index = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    pendingFollowUps: 0,
    criticalCases: 0,
    monthlyVisits: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch stats
      const [patientsResult, appointmentsResult, criticalResult] = await Promise.all([
        supabase.from('patients').select('id, status', { count: 'exact' }),
        supabase
          .from('appointments')
          .select('id, status, date')
          .eq('date', format(new Date(), 'yyyy-MM-dd')),
        supabase.from('patients').select('id').eq('status', 'critical'),
      ]);

      const totalPatients = patientsResult.count || 0;
      const activePatients = patientsResult.data?.filter(p => p.status === 'active').length || 0;
      const todayApts = appointmentsResult.data?.length || 0;
      const criticalCases = criticalResult.data?.length || 0;

      setStats({
        totalPatients,
        activePatients,
        todayAppointments: todayApts,
        pendingFollowUps: 0,
        criticalCases,
        monthlyVisits: 0,
      });

      // Fetch today's appointments
      const { data: aptData } = await supabase
        .from('appointments')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('date', format(new Date(), 'yyyy-MM-dd'))
        .order('start_time', { ascending: true })
        .limit(5);

      setTodayAppointments(aptData || []);

      // Fetch recent patients
      const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPatients(patientData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Set up realtime subscription for appointments
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDashboardData]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Active Patients"
          value={stats.activePatients.toLocaleString()}
          icon={Activity}
          variant="success"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.pendingFollowUps}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Critical Cases"
          value={stats.criticalCases}
          icon={AlertCircle}
          variant="destructive"
        />
        <StatCard
          title="Monthly Visits"
          value={stats.monthlyVisits}
          icon={TrendingUp}
          variant="default"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="health-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
              <Link to="/appointments">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
                <Link to="/appointments">
                  <Button variant="outline" size="sm" className="mt-4">
                    Schedule One
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-card animate-slide-up',
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <span className="text-sm font-medium text-muted-foreground">
                        {appointment.patients?.first_name?.[0]}{appointment.patients?.last_name?.[0]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {appointment.patients?.first_name} {appointment.patients?.last_name}
                        </p>
                        <Badge variant="outline" className="text-xs capitalize bg-primary/10 text-primary">
                          {appointment.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(appointment.start_time)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • {appointment.duration} min
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn('capitalize', statusStyles[appointment.status as keyof typeof statusStyles])}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Recent Patients */}
          <div className="health-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Recent Patients</h3>
              <Link to="/patients">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              {recentPatients.map((patient, index) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  className={cn(
                    'flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-secondary/50 group animate-slide-up'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {patient.first_name} {patient.last_name}
                      </p>
                      {patient.status === 'critical' && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {patient.conditions && patient.conditions.length > 0
                        ? patient.conditions.slice(0, 2).join(', ')
                        : 'No active conditions'}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn('capitalize', patientStatusStyles[patient.status as keyof typeof patientStatusStyles])}
                  >
                    {patient.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
