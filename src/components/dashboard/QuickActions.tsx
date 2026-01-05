import { UserPlus, CalendarPlus, FileText, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    icon: UserPlus,
    label: 'Add Patient',
    description: 'Register new patient',
    color: 'primary' as const,
  },
  {
    icon: CalendarPlus,
    label: 'New Appointment',
    description: 'Schedule visit',
    color: 'info' as const,
  },
  {
    icon: FileText,
    label: 'Create Record',
    description: 'Add medical note',
    color: 'success' as const,
  },
  {
    icon: Clipboard,
    label: 'Lab Request',
    description: 'Order lab tests',
    color: 'warning' as const,
  },
];

const colorStyles = {
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  info: 'bg-info/10 text-info hover:bg-info/20',
  success: 'bg-success/10 text-success hover:bg-success/20',
  warning: 'bg-warning/10 text-warning hover:bg-warning/20',
};

export function QuickActions() {
  return (
    <div className="health-card">
      <h3 className="text-lg font-semibold text-foreground mb-5">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant="ghost"
            className={`h-auto flex-col items-start gap-2 p-4 rounded-xl ${colorStyles[action.color]} animate-scale-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <action.icon className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
