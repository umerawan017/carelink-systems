import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { CalendarPlus, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { NewAppointmentDialog } from '@/components/appointments/NewAppointmentDialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const statusStyles = {
  scheduled: 'bg-info/10 text-info border-info/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [dayAppointments, setDayAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDayAppointments = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (
          first_name,
          last_name
        )
      `)
      .eq('date', format(selectedDate, 'yyyy-MM-dd'))
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setDayAppointments(data || []);
    }
    setLoading(false);
  }, [selectedDate, user]);

  useEffect(() => {
    fetchDayAppointments();
  }, [fetchDayAppointments]);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId);

    if (error) {
      toast.error('Failed to update appointment status');
    } else {
      toast.success(`Appointment marked as ${newStatus}`);
      fetchDayAppointments();
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <DashboardLayout
      title="Appointments"
      subtitle="Schedule and manage patient appointments"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {dayAppointments.length} appointments for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowNewDialog(true)}>
          <CalendarPlus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2">
          <AppointmentCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectAppointment={setSelectedAppointment}
          />
        </div>

        {/* Day View / Details */}
        <div className="space-y-4">
          <div className="health-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchDayAppointments}
                disabled={loading}
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </Button>
            </div>

            {dayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No appointments scheduled</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowNewDialog(true)}
                >
                  Schedule One
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                      selectedAppointment?.id === apt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    )}
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {apt.patients?.first_name} {apt.patients?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn('capitalize text-xs', statusStyles[apt.status as keyof typeof statusStyles])}
                      >
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {apt.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {apt.duration} min
                      </span>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {apt.notes}
                      </p>
                    )}
                    
                    {/* Quick Actions */}
                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                        {apt.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAppointmentStatus(apt.id, 'confirmed');
                            }}
                          >
                            Confirm
                          </Button>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAppointmentStatus(apt.id, 'in-progress');
                            }}
                          >
                            Start
                          </Button>
                        )}
                        {apt.status === 'in-progress' && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateAppointmentStatus(apt.id, 'completed');
                            }}
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAppointmentStatus(apt.id, 'cancelled');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NewAppointmentDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        selectedDate={selectedDate}
        onSuccess={fetchDayAppointments}
      />
    </DashboardLayout>
  );
};

export default Appointments;
