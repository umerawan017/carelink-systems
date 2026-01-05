import { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AddVitalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onSuccess: () => void;
}

export function AddVitalsDialog({ open, onOpenChange, patientId, onSuccess }: AddVitalsDialogProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [oxygenSaturation, setOxygenSaturation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to record vitals');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('vitals')
        .insert({
          patient_id: patientId,
          provider_id: user.id,
          blood_pressure_systolic: systolic ? parseInt(systolic) : null,
          blood_pressure_diastolic: diastolic ? parseInt(diastolic) : null,
          heart_rate: heartRate ? parseInt(heartRate) : null,
          temperature: temperature ? parseFloat(temperature) : null,
          weight: weight ? parseFloat(weight) : null,
          oxygen_saturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
          notes: notes || null,
        });

      if (insertError) {
        throw insertError;
      }

      toast.success('Vitals recorded successfully');
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      console.error('Error recording vitals:', err);
      setError(err.message || 'Failed to record vitals');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setTemperature('');
    setWeight('');
    setOxygenSaturation('');
    setNotes('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Record Vitals
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label>Blood Pressure (mmHg)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Systolic"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                min={60}
                max={250}
              />
              <span className="text-muted-foreground">/</span>
              <Input
                type="number"
                placeholder="Diastolic"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                min={40}
                max={150}
              />
            </div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label>Heart Rate (BPM)</Label>
            <Input
              type="number"
              placeholder="e.g., 72"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              min={30}
              max={200}
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label>Temperature (°F)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 98.6"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              min={95}
              max={108}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <div className="space-y-2">
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 165"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={0}
                max={1000}
              />
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-2">
              <Label>SpO2 (%)</Label>
              <Input
                type="number"
                placeholder="e.g., 98"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
                min={70}
                max={100}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any additional observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Record Vitals'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
