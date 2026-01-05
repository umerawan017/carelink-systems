import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: {
    icon: 'bg-secondary text-secondary-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  primary: {
    icon: 'bg-primary/10 text-primary',
    badge: 'bg-primary/10 text-primary',
  },
  success: {
    icon: 'bg-success/10 text-success',
    badge: 'bg-success/10 text-success',
  },
  warning: {
    icon: 'bg-warning/10 text-warning',
    badge: 'bg-warning/10 text-warning',
  },
  destructive: {
    icon: 'bg-destructive/10 text-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
};

export function StatCard({ title, value, icon: Icon, change, variant = 'default' }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={cn('rounded-lg p-2.5', styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        {change && (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              change.type === 'increase'
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            {change.type === 'increase' ? '+' : '-'}
            {Math.abs(change.value)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}
