import { FileText, Upload } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { mockMedicalLogs } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const logTypeStyles = {
  visit: 'bg-primary/10 text-primary',
  lab: 'bg-info/10 text-info',
  prescription: 'bg-success/10 text-success',
  procedure: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
};

const Records = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout
      title="Medical Records"
      subtitle="View and manage patient medical records"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {mockMedicalLogs.length} medical records in the system
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Record
        </Button>
      </div>

      <div className="health-card">
        <div className="space-y-4">
          {mockMedicalLogs.map((log, index) => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0',
                  logTypeStyles[log.type]
                )}
              >
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">
                        {log.title}
                      </h4>
                      <Badge variant="outline" className="capitalize text-xs">
                        {log.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {log.providerName} • {formatDate(log.date)}
                    </p>
                  </div>
                </div>
                <p className="text-foreground mt-2 line-clamp-2">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Records;
