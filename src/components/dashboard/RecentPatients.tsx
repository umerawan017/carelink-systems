import { ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecentPatientsProps {
  patients: Patient[];
}

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentPatients({ patients }: RecentPatientsProps) {
  return (
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
        {patients.slice(0, 5).map((patient, index) => (
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
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {patient.firstName} {patient.lastName}
                </p>
                {patient.status === 'critical' && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {patient.conditions.length > 0
                  ? patient.conditions.slice(0, 2).join(', ')
                  : 'No active conditions'}
              </p>
            </div>

            <Badge
              variant="outline"
              className={cn('capitalize', statusStyles[patient.status])}
            >
              {patient.status}
            </Badge>

            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
