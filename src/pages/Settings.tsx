import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-2xl space-y-8">
        {/* Profile Settings */}
        <div className="health-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Amanda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Foster" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="amanda.foster@medcare.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" defaultValue="Primary Care" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="health-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Appointment Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications before scheduled appointments
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Critical Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about critical patient status changes
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Lab Results</p>
                <p className="text-sm text-muted-foreground">
                  Notifications when new lab results are available
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Digest</p>
                <p className="text-sm text-muted-foreground">
                  Daily summary of patient activities
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="health-card">
          <h3 className="text-lg font-semibold text-foreground mb-6">Privacy & Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Session Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after inactivity
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
