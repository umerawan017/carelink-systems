import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Heart, Activity, Scale, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface VitalsChartProps {
  patientId: string;
}

interface VitalRecord {
  id: string;
  recorded_at: string;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  heart_rate: number | null;
  temperature: number | null;
  weight: number | null;
}

const timeRanges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '3 Months' },
  { value: '1y', label: '1 Year' },
];

export function VitalsChart({ patientId }: VitalsChartProps) {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('bloodPressure');

  useEffect(() => {
    const fetchVitals = async () => {
      setLoading(true);
      
      let startDate: Date;
      switch (timeRange) {
        case '7d':
          startDate = subDays(new Date(), 7);
          break;
        case '30d':
          startDate = subDays(new Date(), 30);
          break;
        case '90d':
          startDate = subMonths(new Date(), 3);
          break;
        case '1y':
          startDate = subMonths(new Date(), 12);
          break;
        default:
          startDate = subDays(new Date(), 30);
      }

      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true });

      if (error) {
        console.error('Error fetching vitals:', error);
      } else {
        setVitals(data || []);
      }
      setLoading(false);
    };

    fetchVitals();
  }, [patientId, timeRange]);

  const chartData = vitals.map((v) => ({
    date: format(new Date(v.recorded_at), 'MMM d'),
    fullDate: format(new Date(v.recorded_at), 'MMM d, yyyy h:mm a'),
    systolic: v.blood_pressure_systolic,
    diastolic: v.blood_pressure_diastolic,
    heartRate: v.heart_rate,
    temperature: v.temperature,
    weight: v.weight,
  }));

  const latestVitals = vitals[vitals.length - 1];

  const getStatusColor = (metric: string, value: number | null) => {
    if (value === null) return 'muted';
    
    switch (metric) {
      case 'systolic':
        if (value < 90) return 'warning';
        if (value > 140) return 'destructive';
        return 'success';
      case 'diastolic':
        if (value < 60) return 'warning';
        if (value > 90) return 'destructive';
        return 'success';
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        return 'success';
      case 'temperature':
        if (value < 97 || value > 99.5) return 'warning';
        if (value > 100.4) return 'destructive';
        return 'success';
      default:
        return 'muted';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">{payload[0]?.payload?.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="health-card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Heart className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Blood Pressure</span>
          </div>
          <p className="text-2xl font-semibold">
            {latestVitals?.blood_pressure_systolic && latestVitals?.blood_pressure_diastolic
              ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}`
              : '--/--'}
          </p>
          <Badge
            variant="outline"
            className={cn(
              'mt-2',
              latestVitals?.blood_pressure_systolic && 
              (latestVitals.blood_pressure_systolic > 140 
                ? 'bg-destructive/10 text-destructive border-destructive/20'
                : 'bg-success/10 text-success border-success/20')
            )}
          >
            mmHg
          </Badge>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Heart Rate</span>
          </div>
          <p className="text-2xl font-semibold">
            {latestVitals?.heart_rate ?? '--'}
          </p>
          <Badge
            variant="outline"
            className={cn(
              'mt-2',
              latestVitals?.heart_rate && 
              (latestVitals.heart_rate < 60 || latestVitals.heart_rate > 100
                ? 'bg-warning/10 text-warning border-warning/20'
                : 'bg-success/10 text-success border-success/20')
            )}
          >
            BPM
          </Badge>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-warning/10">
              <Thermometer className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <p className="text-2xl font-semibold">
            {latestVitals?.temperature ?? '--'}
          </p>
          <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
            °F
          </Badge>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-info/10">
              <Scale className="h-4 w-4 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Weight</span>
          </div>
          <p className="text-2xl font-semibold">
            {latestVitals?.weight ?? '--'}
          </p>
          <Badge variant="outline" className="mt-2">lbs</Badge>
        </div>
      </div>

      {/* Charts */}
      <div className="health-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Vitals History</h3>
          <div className="flex items-center gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {vitals.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Vitals Data</h3>
            <p className="text-muted-foreground mt-1">
              No vital signs have been recorded for this time period.
            </p>
          </div>
        ) : (
          <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
            <TabsList className="mb-6">
              <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
              <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
            </TabsList>

            <TabsContent value="bloodPressure" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 180]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="systolic"
                    name="Systolic"
                    stroke="hsl(var(--destructive))"
                    fill="url(#systolicGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="diastolic"
                    name="Diastolic"
                    stroke="hsl(var(--primary))"
                    fill="url(#diastolicGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="heartRate" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 120]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    name="Heart Rate (BPM)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="weight" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    name="Weight (lbs)"
                    stroke="hsl(var(--info))"
                    fill="url(#weightGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="temperature" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[96, 102]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°F)"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
