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
  Plus,
  Search,
  Filter,
  UserPlus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Child } from '@/lib/types';
import { VACCINE_SCHEDULE } from '@/lib/constants';

// Mock data for demonstration
const mockChildren: Child[] = [
  {
    id: 'CHD001',
    name: 'Sarah Johnson',
    dateOfBirth: new Date('2024-03-15'),
    gender: 'female',
    guardianName: 'Mary Johnson',
    guardianPhone: '+675 123 4567',
    guardianEmail: 'mary.johnson@email.com',
    address: '123 Main St, Port Moresby',
    ward: 'Ward 5',
    facility: 'Port Moresby General Hospital',
    registrationDate: new Date('2024-03-16'),
    status: 'active',
  },
  {
    id: 'CHD002',
    name: 'Michael Smith',
    dateOfBirth: new Date('2024-01-20'),
    gender: 'male',
    guardianName: 'John Smith',
    guardianPhone: '+675 987 6543',
    address: '456 Oak Ave, Lae',
    ward: 'Ward 3',
    facility: 'Lae District Hospital',
    registrationDate: new Date('2024-01-21'),
    status: 'active',
  },
  {
    id: 'CHD003',
    name: 'Emma Wilson',
    dateOfBirth: new Date('2023-11-10'),
    gender: 'female',
    guardianName: 'Lisa Wilson',
    guardianPhone: '+675 555 1234',
    address: '789 Pine St, Mount Hagen',
    ward: 'Ward 7',
    facility: 'Mount Hagen Hospital',
    registrationDate: new Date('2023-11-11'),
    status: 'active',
  },
];

const calculateAge = (dateOfBirth: Date): string => {
  const now = new Date();
  const ageInMs = now.getTime() - dateOfBirth.getTime();
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

  if (ageInDays < 30) {
    return `${ageInDays} days`;
  } else if (ageInDays < 365) {
    const months = Math.floor(ageInDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(ageInDays / 365);
    const remainingMonths = Math.floor((ageInDays % 365) / 30);
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  }
};

const getImmunizationStatus = (child: Child): { status: string; color: string; vaccinesCompleted: number; totalVaccines: number } => {
  const ageInWeeks = Math.floor((new Date().getTime() - child.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const dueVaccines = VACCINE_SCHEDULE.filter(vaccine => vaccine.ageInWeeks <= ageInWeeks);

  // For demo purposes, randomly assign completion status
  const completed = Math.floor(dueVaccines.length * (0.7 + Math.random() * 0.3));

  if (completed === dueVaccines.length && completed > 0) {
    return { status: 'Up to date', color: 'bg-green-100 text-green-800', vaccinesCompleted: completed, totalVaccines: dueVaccines.length };
  } else if (completed > 0) {
    return { status: 'Partially immunized', color: 'bg-yellow-100 text-yellow-800', vaccinesCompleted: completed, totalVaccines: dueVaccines.length };
  } else {
    return { status: 'Not started', color: 'bg-red-100 text-red-800', vaccinesCompleted: 0, totalVaccines: dueVaccines.length };
  }
};

const ChildRegistrationForm = ({ onSubmit }: { onSubmit: (child: Partial<Child>) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    ward: '',
    facility: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      gender: formData.gender as 'male' | 'female',
      dateOfBirth: new Date(formData.dateOfBirth),
      registrationDate: new Date(),
      status: 'active' as const,
      id: `CHD${Math.random().toString().slice(2, 5)}`,
    });
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      address: '',
      ward: '',
      facility: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Child's Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian's Name *</Label>
          <Input
            id="guardianName"
            value={formData.guardianName}
            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianPhone">Guardian's Phone *</Label>
          <Input
            id="guardianPhone"
            type="tel"
            value={formData.guardianPhone}
            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianEmail">Guardian's Email</Label>
          <Input
            id="guardianEmail"
            type="email"
            value={formData.guardianEmail}
            onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward">Ward *</Label>
          <Select value={formData.ward} onValueChange={(value) => setFormData({ ...formData, ward: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ward 1">Ward 1</SelectItem>
              <SelectItem value="Ward 2">Ward 2</SelectItem>
              <SelectItem value="Ward 3">Ward 3</SelectItem>
              <SelectItem value="Ward 4">Ward 4</SelectItem>
              <SelectItem value="Ward 5">Ward 5</SelectItem>
              <SelectItem value="Ward 6">Ward 6</SelectItem>
              <SelectItem value="Ward 7">Ward 7</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facility">Health Facility *</Label>
          <Select value={formData.facility} onValueChange={(value) => setFormData({ ...formData, facility: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select facility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Port Moresby General Hospital">Port Moresby General Hospital</SelectItem>
              <SelectItem value="Lae District Hospital">Lae District Hospital</SelectItem>
              <SelectItem value="Mount Hagen Hospital">Mount Hagen Hospital</SelectItem>
              <SelectItem value="Madang Hospital">Madang Hospital</SelectItem>
              <SelectItem value="Daru Hospital">Daru Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <UserPlus className="h-4 w-4 mr-2" />
          Register Child
        </Button>
      </div>
    </form>
  );
};

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>(mockChildren);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWard, setFilterWard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleRegistration = (newChild: Partial<Child>) => {
    setChildren([...children, newChild as Child]);
    setShowRegistrationForm(false);
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.guardianName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWard = filterWard === 'all' || child.ward === filterWard;
    const matchesStatus = filterStatus === 'all' || child.status === filterStatus;

    return matchesSearch && matchesWard && matchesStatus;
  });

  const stats = {
    total: children.length,
    active: children.filter(c => c.status === 'active').length,
    thisMonth: children.filter(c => {
      const now = new Date();
      const regDate = c.registrationDate;
      return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Child Registry</h1>
          <p className="text-muted-foreground">
            Register and manage children under 1 year for immunization tracking
          </p>
        </div>

        <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register New Child
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Child</DialogTitle>
              <DialogDescription>
                Add a new child to the immunization monitoring system.
              </DialogDescription>
            </DialogHeader>
            <ChildRegistrationForm onSubmit={handleRegistration} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Immunization coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                  placeholder="Search by name, ID, or guardian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                <SelectItem value="Ward 1">Ward 1</SelectItem>
                <SelectItem value="Ward 2">Ward 2</SelectItem>
                <SelectItem value="Ward 3">Ward 3</SelectItem>
                <SelectItem value="Ward 4">Ward 4</SelectItem>
                <SelectItem value="Ward 5">Ward 5</SelectItem>
                <SelectItem value="Ward 6">Ward 6</SelectItem>
                <SelectItem value="Ward 7">Ward 7</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="moved">Moved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Children Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Children ({filteredChildren.length})</CardTitle>
          <CardDescription>
            List of all children registered in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Child ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Immunization Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => {
                  const immunizationStatus = getImmunizationStatus(child);
                  return (
                    <TableRow key={child.id}>
                      <TableCell className="font-medium">{child.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{child.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {child.gender}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{calculateAge(child.dateOfBirth)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{child.guardianName}</div>
                          <div className="text-sm text-muted-foreground">
                            {child.guardianPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{child.ward}</div>
                          <div className="text-sm text-muted-foreground">{child.facility}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className={immunizationStatus.color}>
                            {immunizationStatus.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {immunizationStatus.vaccinesCompleted}/{immunizationStatus.totalVaccines} vaccines
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredChildren.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No children found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or register a new child.
              </p>
              <Button onClick={() => setShowRegistrationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register First Child
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
