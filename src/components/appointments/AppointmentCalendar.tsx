import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  type: string;
  status: string;
  notes: string | null;
  patients?: {
    first_name: string;
    last_name: string;
  };
}

interface AppointmentCalendarProps {
  onSelectDate: (date: Date) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  selectedDate: Date;
}

const statusColors = {
  scheduled: 'bg-info/20 text-info border-info/30',
  confirmed: 'bg-success/20 text-success border-success/30',
  'in-progress': 'bg-warning/20 text-warning border-warning/30',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function AppointmentCalendar({ onSelectDate, onSelectAppointment, selectedDate }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) return;
    
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients (
          first_name,
          last_name
        )
      `)
      .gte('date', format(start, 'yyyy-MM-dd'))
      .lte('date', format(end, 'yyyy-MM-dd'))
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentMonth, user]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('appointments-calendar')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        (payload) => {
          console.log('Appointment change:', payload);
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => 
      isSameDay(new Date(apt.date), day)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="health-card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentMonth(new Date());
              onSelectDate(new Date());
            }}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                'min-h-[100px] p-2 rounded-lg border transition-all duration-200 text-left',
                !isCurrentMonth && 'opacity-40',
                isSelected && 'border-primary bg-primary/5',
                !isSelected && 'border-transparent hover:border-border hover:bg-secondary/50',
                isToday && !isSelected && 'bg-accent/50'
              )}
            >
              <div className={cn(
                'text-sm font-medium mb-1',
                isToday && 'text-primary',
                !isCurrentMonth && 'text-muted-foreground'
              )}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAppointment(apt);
                    }}
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity',
                      statusColors[apt.status as keyof typeof statusColors]
                    )}
                  >
                    {apt.start_time.slice(0, 5)} {apt.patients?.first_name}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
