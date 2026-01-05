import { FileText, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const logTypeStyles = {
  visit: 'bg-primary/10 text-primary',
  lab: 'bg-info/10 text-info',
  prescription: 'bg-success/10 text-success',
  procedure: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
};

const Records = () => {
  const [medicalLogs, setMedicalLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('medical_logs')
        .select(`
          *,
          patients (
            first_name,
            last_name
          ),
          profiles:provider_id (
            first_name,
            last_name
          )
        `)
        .order('date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setMedicalLogs(data || []);
      }
      setLoading(false);
    };

    fetchRecords();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Medical Records" subtitle="View and manage patient medical records">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Medical Records"
      subtitle="View and manage patient medical records"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {medicalLogs.length} medical records in the system
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Record
        </Button>
      </div>

      {medicalLogs.length === 0 ? (
        <div className="health-card text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No Records Yet</h3>
          <p className="text-muted-foreground mt-1">
            Medical records will appear here when added.
          </p>
        </div>
      ) : (
        <div className="health-card">
          <div className="space-y-4">
            {medicalLogs.map((log, index) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0',
                    logTypeStyles[log.type as keyof typeof logTypeStyles]
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
                        {log.patients?.first_name} {log.patients?.last_name} • {formatDate(log.date)}
                      </p>
                      {log.profiles && (
                        <p className="text-xs text-muted-foreground">
                          By: {log.profiles.first_name} {log.profiles.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground mt-2 line-clamp-2">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Records;
