import { Clock, User, MoreHorizontal } from 'lucide-react';
import { Appointment } from '@/types/patient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppointmentsListProps {
  appointments: Appointment[];
}

const statusStyles = {
  scheduled: 'bg-info/10 text-info border-info/20',
  confirmed: 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-muted text-muted-foreground border-muted',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
};

const typeStyles = {
  checkup: 'bg-primary/10 text-primary',
  'follow-up': 'bg-info/10 text-info',
  consultation: 'bg-accent text-accent-foreground',
  procedure: 'bg-warning/10 text-warning',
  emergency: 'bg-destructive/10 text-destructive',
};

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  return (
    <div className="health-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className={cn(
              'flex items-center gap-4 rounded-lg border border-border p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-card animate-slide-up',
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {appointment.patientName}
                </p>
                <Badge variant="outline" className={cn('text-xs', typeStyles[appointment.type])}>
                  {appointment.type}
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {appointment.time}
                </span>
                <span className="text-sm text-muted-foreground">
                  • {appointment.duration} min
                </span>
                <span className="text-sm text-muted-foreground">
                  • {appointment.providerName}
                </span>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn('capitalize', statusStyles[appointment.status])}
            >
              {appointment.status}
            </Badge>

            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
