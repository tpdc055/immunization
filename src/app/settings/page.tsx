'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Users,
  Shield,
  Key,
  Bell,
  Database,
  Download,
  Upload,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Save,
  RefreshCw,
  Lock,
  Unlock,
  UserPlus,
  UserCheck,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Palette,
  Globe,
  Server,
  HardDrive,
  FileText
} from 'lucide-react';
import { User } from '@/lib/types';
import { USER_ROLES, SYSTEM_CONSTANTS } from '@/lib/constants';

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'USR001',
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@health.gov.pg',
    role: 'administrator',
    facility: 'Port Moresby General Hospital',
    ward: 'Ward 5',
    district: 'National Capital District',
    province: 'National Capital District',
    isActive: true,
    lastLogin: new Date('2024-07-01T09:30:00'),
    createdDate: new Date('2024-01-15'),
  },
  {
    id: 'USR002',
    name: 'John Miller',
    email: 'john.miller@health.gov.pg',
    role: 'health_worker',
    facility: 'Lae District Hospital',
    ward: 'Ward 3',
    district: 'Lae',
    province: 'Morobe',
    isActive: true,
    lastLogin: new Date('2024-06-30T14:15:00'),
    createdDate: new Date('2024-02-01'),
  },
  {
    id: 'USR003',
    name: 'Mary Johnson',
    email: 'mary.johnson@finance.gov.pg',
    role: 'finance_officer',
    isActive: true,
    lastLogin: new Date('2024-06-29T11:45:00'),
    createdDate: new Date('2024-01-20'),
  },
  {
    id: 'USR004',
    name: 'Peter Wilson',
    email: 'peter.wilson@program.org',
    role: 'program_manager',
    isActive: true,
    lastLogin: new Date('2024-06-28T16:20:00'),
    createdDate: new Date('2024-03-01'),
  },
  {
    id: 'USR005',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@donor.org',
    role: 'donor',
    isActive: true,
    lastLogin: new Date('2024-06-25T10:00:00'),
    createdDate: new Date('2024-01-10'),
  },
];

const UserForm = ({ user, onSubmit }: { user?: User; onSubmit: (user: Partial<User>) => void }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'health_worker',
    facility: user?.facility || '',
    ward: user?.ward || '',
    district: user?.district || '',
    province: user?.province || '',
    isActive: user?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      id: user?.id || `USR${Math.random().toString().slice(2, 5)}`,
      createdDate: user?.createdDate || new Date(),
    });

    if (!user) {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        role: 'health_worker',
        facility: '',
        ward: '',
        district: '',
        province: '',
        isActive: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'administrator' | 'health_worker' | 'finance_officer' | 'program_manager' | 'donor' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(USER_ROLES).map(([key, role]) => (
                <SelectItem key={key} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="National Capital District">National Capital District</SelectItem>
              <SelectItem value="Western">Western</SelectItem>
              <SelectItem value="Southern Highlands">Southern Highlands</SelectItem>
              <SelectItem value="Morobe">Morobe</SelectItem>
              <SelectItem value="Madang">Madang</SelectItem>
              <SelectItem value="Eastern Highlands">Eastern Highlands</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            placeholder="District name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Ward</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            placeholder="Ward designation"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="facility">Health Facility</Label>
          <Input
            id="facility"
            value={formData.facility}
            onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
            placeholder="Health facility name"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isActive" className="text-sm">Account is active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {user ? <Save className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: SYSTEM_CONSTANTS.SESSION_TIMEOUT_MINUTES,
    pageSize: SYSTEM_CONSTANTS.PAGINATION_PAGE_SIZE,
    maxFileSize: SYSTEM_CONSTANTS.MAX_FILE_SIZE_MB,
    overdueThreshold: SYSTEM_CONSTANTS.OVERDUE_THRESHOLD_DAYS,
    reminderDays: SYSTEM_CONSTANTS.ALERT_REMINDER_DAYS,
    autoBackup: true,
    emailNotifications: true,
    smsAlerts: false,
  });

  const handleUserSubmit = (userData: Partial<User>) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user =>
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
      setEditingUser(undefined);
    } else {
      // Create new user
      setUsers([userData as User, ...users]);
    }
    setShowUserForm(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive: false } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'administrator').length,
    recentLogins: users.filter(u => {
      if (!u.lastLogin) return false;
      const daysSinceLogin = (new Date().getTime() - u.lastLogin.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLogin <= 7;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage users, system configuration, and security settings
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Configuration</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Logins</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentLogins}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                <Lock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">User Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Manage user accounts, roles, and permissions
              </p>
            </div>

            <Dialog open={showUserForm} onOpenChange={(open) => {
              setShowUserForm(open);
              if (!open) setEditingUser(undefined);
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Edit User Account' : 'Create New User Account'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Update user information and permissions.' : 'Add a new user to the system with appropriate role and permissions.'}
                  </DialogDescription>
                </DialogHeader>
                <UserForm user={editingUser} onSubmit={handleUserSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search and Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.entries(USER_ROLES).map(([key, role]) => (
                      <SelectItem key={key} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const role = Object.values(USER_ROLES).find(r => r.id === user.role);
                      const daysSinceLogin = user.lastLogin ?
                        Math.floor((new Date().getTime() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : null;

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              user.role === 'administrator' ? 'bg-red-100 text-red-800' :
                              user.role === 'program_manager' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'finance_officer' ? 'bg-green-100 text-green-800' :
                              user.role === 'health_worker' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {role?.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.facility && <div className="font-medium">{user.facility}</div>}
                              {user.ward && <div className="text-muted-foreground">{user.ward}</div>}
                              {user.district && <div className="text-muted-foreground">{user.district}, {user.province}</div>}
                              {!user.facility && !user.ward && !user.district && (
                                <span className="text-muted-foreground">Not specified</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? (
                              <div className="text-sm">
                                <div>{user.lastLogin.toLocaleDateString()}</div>
                                <div className="text-muted-foreground">
                                  {daysSinceLogin === 0 ? 'Today' :
                                   daysSinceLogin === 1 ? 'Yesterday' :
                                   `${daysSinceLogin} days ago`}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {user.isActive ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeactivateUser(user.id)}
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm">
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure global system settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session & Security</h3>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        sessionTimeout: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      How long users stay logged in without activity
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        maxFileSize: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum file size for document uploads
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Application Settings</h3>

                  <div className="space-y-2">
                    <Label htmlFor="pageSize">Page Size</Label>
                    <Input
                      id="pageSize"
                      type="number"
                      value={systemSettings.pageSize}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        pageSize: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of items displayed per page in tables
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overdueThreshold">Overdue Threshold (days)</Label>
                    <Input
                      id="overdueThreshold"
                      type="number"
                      value={systemSettings.overdueThreshold}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        overdueThreshold: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days after scheduled date to mark vaccines as overdue
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderDays">Reminder Days</Label>
                    <Input
                      id="reminderDays"
                      type="number"
                      value={systemSettings.reminderDays}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        reminderDays: parseInt(e.target.value)
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before due date to send vaccination reminders
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save System Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Server className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">System Version</span>
                  </div>
                  <p className="text-sm text-muted-foreground">CIMGS v1.0.0</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Database Status</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <HardDrive className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm font-medium">Storage Used</span>
                  </div>
                  <p className="text-sm text-muted-foreground">2.4 GB / 10 GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for administrator accounts
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Password Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      Minimum 8 characters, mixed case, numbers, symbols
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Session Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic logout on suspicious activity
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log all user actions and system changes
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>
                Role-based permissions and access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(USER_ROLES).map(([key, role]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.name}</h4>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Permissions:</strong> {role.permissions.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and SMS notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Send email alerts for overdue vaccinations and budget alerts
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.emailNotifications}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      emailNotifications: e.target.checked
                    })}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-sm font-medium">SMS Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Send SMS for critical alerts and reminders
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.smsAlerts}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      smsAlerts: e.target.checked
                    })}
                    className="rounded"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overdue Vaccinations</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Threshold Alerts</span>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Governance Tasks Due</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Monthly Reports Ready</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Info</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Maintenance</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">System</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New User Registration</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Success</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup & Export</CardTitle>
              <CardDescription>
                Manage system backups and data exports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Automatic Backups</h4>
                    <p className="text-sm text-muted-foreground">
                      Daily automated backups at 2:00 AM
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemSettings.autoBackup}
                    onChange={(e) => setSystemSettings({
                      ...systemSettings,
                      autoBackup: e.target.checked
                    })}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Last Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      July 1, 2024 at 2:00 AM (Success)
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Manual Operations</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <Download className="h-6 w-6 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">Create Backup</div>
                        <div className="text-sm text-muted-foreground">Generate manual system backup</div>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <Upload className="h-6 w-6 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">Restore Backup</div>
                        <div className="text-sm text-muted-foreground">Restore from backup file</div>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Export Data</div>
                        <div className="text-sm text-muted-foreground">Export all data to CSV/Excel</div>
                      </div>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-6 w-6 text-orange-500" />
                      <div className="text-left">
                        <div className="font-medium">System Reset</div>
                        <div className="text-sm text-muted-foreground">Reset to factory defaults</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
