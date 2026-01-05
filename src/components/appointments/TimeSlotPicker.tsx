import { useState, useEffect } from 'react';
import { format, addMinutes, parse, isBefore, isAfter, setHours, setMinutes } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TimeSlot {
  time: string;
  available: boolean;
  conflictReason?: string;
}

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  duration: number;
}

const WORK_START = 8; // 8 AM
const WORK_END = 18; // 6 PM
const SLOT_INTERVAL = 30; // 30 minutes

export function TimeSlotPicker({ selectedDate, selectedTime, onSelectTime, duration }: TimeSlotPickerProps) {
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .neq('status', 'cancelled');

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setExistingAppointments(data || []);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [selectedDate, user]);

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let currentTime = setMinutes(setHours(selectedDate, WORK_START), 0);
    const endTime = setMinutes(setHours(selectedDate, WORK_END), 0);

    while (isBefore(currentTime, endTime)) {
      const timeString = format(currentTime, 'HH:mm');
      const slotEnd = addMinutes(currentTime, duration);
      
      // Check for conflicts
      let available = true;
      let conflictReason = '';

      for (const apt of existingAppointments) {
        const aptStart = parse(apt.start_time, 'HH:mm:ss', selectedDate);
        const aptEnd = parse(apt.end_time, 'HH:mm:ss', selectedDate);

        // Check if the new slot overlaps with existing appointment
        const slotStartsBeforeAptEnds = isBefore(currentTime, aptEnd);
        const slotEndsAfterAptStarts = isAfter(slotEnd, aptStart);

        if (slotStartsBeforeAptEnds && slotEndsAfterAptStarts) {
          available = false;
          conflictReason = `Conflicts with appointment at ${format(aptStart, 'h:mm a')}`;
          break;
        }
      }

      // Check if slot end exceeds work hours
      if (isAfter(slotEnd, endTime)) {
        available = false;
        conflictReason = 'Exceeds work hours';
      }

      slots.push({ time: timeString, available, conflictReason });
      currentTime = addMinutes(currentTime, SLOT_INTERVAL);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const morningSlots = timeSlots.filter((slot) => parseInt(slot.time.split(':')[0]) < 12);
  const afternoonSlots = timeSlots.filter((slot) => parseInt(slot.time.split(':')[0]) >= 12);

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="health-card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="health-card">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Available Times for {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Morning Slots */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Morning</p>
          <div className="grid grid-cols-4 gap-2">
            {morningSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? 'default' : 'outline'}
                size="sm"
                disabled={!slot.available}
                onClick={() => onSelectTime(slot.time)}
                className={cn(
                  'relative',
                  !slot.available && 'opacity-50 cursor-not-allowed'
                )}
                title={slot.conflictReason}
              >
                {formatTimeDisplay(slot.time)}
                {!slot.available && (
                  <AlertTriangle className="absolute -top-1 -right-1 h-3 w-3 text-warning" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Afternoon Slots */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Afternoon</p>
          <div className="grid grid-cols-4 gap-2">
            {afternoonSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? 'default' : 'outline'}
                size="sm"
                disabled={!slot.available}
                onClick={() => onSelectTime(slot.time)}
                className={cn(
                  'relative',
                  !slot.available && 'opacity-50 cursor-not-allowed'
                )}
                title={slot.conflictReason}
              >
                {formatTimeDisplay(slot.time)}
                {!slot.available && (
                  <AlertTriangle className="absolute -top-1 -right-1 h-3 w-3 text-warning" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-border" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted opacity-50" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
