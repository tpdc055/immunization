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
  Calendar,
  Syringe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { VaccineRecord, Child } from '@/lib/types';
import { VACCINE_SCHEDULE } from '@/lib/constants';

// Mock data for demonstration
const mockVaccineRecords: VaccineRecord[] = [
  {
    id: 'VR001',
    childId: 'CHD001',
    vaccineScheduleId: 'bcg-birth',
    scheduledDate: new Date('2024-03-15'),
    administeredDate: new Date('2024-03-16'),
    batchNumber: 'BCG2024001',
    facilityName: 'Port Moresby General Hospital',
    officerName: 'Dr. Sarah Williams',
    status: 'completed',
    notes: 'No adverse reactions observed',
  },
  {
    id: 'VR002',
    childId: 'CHD001',
    vaccineScheduleId: 'dpt-hepb-hib-1',
    scheduledDate: new Date('2024-04-26'),
    status: 'scheduled',
  },
  {
    id: 'VR003',
    childId: 'CHD002',
    vaccineScheduleId: 'bcg-birth',
    scheduledDate: new Date('2024-01-20'),
    administeredDate: new Date('2024-01-21'),
    batchNumber: 'BCG2024002',
    facilityName: 'Lae District Hospital',
    officerName: 'Dr. John Miller',
    status: 'completed',
  },
  {
    id: 'VR004',
    childId: 'CHD002',
    vaccineScheduleId: 'dpt-hepb-hib-1',
    scheduledDate: new Date('2024-03-02'),
    status: 'overdue',
  },
];

const mockChildren: Child[] = [
  {
    id: 'CHD001',
    name: 'Sarah Johnson',
    dateOfBirth: new Date('2024-03-15'),
    gender: 'female',
    guardianName: 'Mary Johnson',
    guardianPhone: '+675 123 4567',
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
];

const RecordVaccineForm = ({
  vaccineRecord,
  onSubmit
}: {
  vaccineRecord: VaccineRecord;
  onSubmit: (record: VaccineRecord) => void;
}) => {
  const [formData, setFormData] = useState({
    administeredDate: new Date().toISOString().split('T')[0],
    batchNumber: '',
    facilityName: vaccineRecord.facilityName || '',
    officerName: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...vaccineRecord,
      ...formData,
      administeredDate: new Date(formData.administeredDate),
      status: 'completed',
    });
  };

  const vaccine = VACCINE_SCHEDULE.find(v => v.id === vaccineRecord.vaccineScheduleId);
  const child = mockChildren.find(c => c.id === vaccineRecord.childId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Vaccination Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Child:</span> {child?.name}
            </div>
            <div>
              <span className="font-medium">Vaccine:</span> {vaccine?.vaccineName}
            </div>
            <div>
              <span className="font-medium">Dose:</span> {vaccine?.doseNumber}
            </div>
            <div>
              <span className="font-medium">Scheduled Date:</span> {vaccineRecord.scheduledDate.toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="administeredDate">Date Administered *</Label>
          <Input
            id="administeredDate"
            type="date"
            value={formData.administeredDate}
            onChange={(e) => setFormData({ ...formData, administeredDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number *</Label>
          <Input
            id="batchNumber"
            value={formData.batchNumber}
            onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            placeholder="e.g., BCG2024001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilityName">Facility Name *</Label>
          <Input
            id="facilityName"
            value={formData.facilityName}
            onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="officerName">Health Officer *</Label>
          <Input
            id="officerName"
            value={formData.officerName}
            onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
            placeholder="Name of administering officer"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any observations or notes"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Syringe className="h-4 w-4 mr-2" />
          Record Vaccination
        </Button>
      </div>
    </form>
  );
};

export default function VaccinesPage() {
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>(mockVaccineRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVaccine, setFilterVaccine] = useState('all');

  const handleRecordVaccine = (updatedRecord: VaccineRecord) => {
    setVaccineRecords(records =>
      records.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const filteredRecords = vaccineRecords.filter(record => {
    const child = mockChildren.find(c => c.id === record.childId);
    const vaccine = VACCINE_SCHEDULE.find(v => v.id === record.vaccineScheduleId);

    const matchesSearch = child?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaccine?.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesVaccine = filterVaccine === 'all' || record.vaccineScheduleId === filterVaccine;

    return matchesSearch && matchesStatus && matchesVaccine;
  });

  // Calculate statistics
  const stats = {
    total: vaccineRecords.length,
    completed: vaccineRecords.filter(r => r.status === 'completed').length,
    scheduled: vaccineRecords.filter(r => r.status === 'scheduled').length,
    overdue: vaccineRecords.filter(r => r.status === 'overdue').length,
    missed: vaccineRecords.filter(r => r.status === 'missed').length,
  };

  const upcomingVaccinations = vaccineRecords
    .filter(r => r.status === 'scheduled')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
    .slice(0, 5);

  const overdueVaccinations = vaccineRecords
    .filter(r => r.status === 'overdue')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vaccine Schedule</h1>
        <p className="text-muted-foreground">
          Manage immunization schedules and track vaccine administration
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vaccines</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.missed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.overdue > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>{stats.overdue} vaccinations are overdue.</strong> Immediate action required to ensure children receive their immunizations.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Vaccination Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({stats.scheduled})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
          <TabsTrigger value="national">National Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
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
                      placeholder="Search by child name, vaccine, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterVaccine} onValueChange={setFilterVaccine}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vaccines</SelectItem>
                    {VACCINE_SCHEDULE.map(vaccine => (
                      <SelectItem key={vaccine.id} value={vaccine.id}>
                        {vaccine.vaccineName} {vaccine.doseNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vaccination Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records ({filteredRecords.length})</CardTitle>
              <CardDescription>
                Complete vaccination history and scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Child</TableHead>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Administered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const child = mockChildren.find(c => c.id === record.childId);
                      const vaccine = VACCINE_SCHEDULE.find(v => v.id === record.vaccineScheduleId);

                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{child?.name}</div>
                              <div className="text-sm text-muted-foreground">{record.childId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vaccine?.vaccineName}</div>
                              <div className="text-sm text-muted-foreground">
                                Dose {vaccine?.doseNumber} • {vaccine?.ageInWeeks} weeks
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{record.scheduledDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              record.status === 'completed' ? 'bg-green-100 text-green-800' :
                              record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              record.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.administeredDate ? (
                              <div>
                                <div className="font-medium">
                                  {record.administeredDate.toLocaleDateString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {record.officerName}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not administered</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {record.status !== 'completed' && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Syringe className="h-4 w-4 mr-1" />
                                      Record
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Record Vaccination</DialogTitle>
                                      <DialogDescription>
                                        Record the administration of this vaccine.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <RecordVaccineForm
                                      vaccineRecord={record}
                                      onSubmit={handleRecordVaccine}
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
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

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Vaccinations</CardTitle>
              <CardDescription>
                Children scheduled for vaccinations in the coming days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingVaccinations.map((record) => {
                  const child = mockChildren.find(c => c.id === record.childId);
                  const vaccine = VACCINE_SCHEDULE.find(v => v.id === record.vaccineScheduleId);

                  return (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{child?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {vaccine?.vaccineName} (Dose {vaccine?.doseNumber})
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {record.scheduledDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Syringe className="h-4 w-4 mr-1" />
                          Record
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {upcomingVaccinations.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming vaccinations</h3>
                    <p className="text-muted-foreground">
                      All scheduled vaccinations are up to date.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Overdue Vaccinations</CardTitle>
              <CardDescription>
                Children who have missed their scheduled vaccination dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overdueVaccinations.map((record) => {
                  const child = mockChildren.find(c => c.id === record.childId);
                  const vaccine = VACCINE_SCHEDULE.find(v => v.id === record.vaccineScheduleId);
                  const daysOverdue = Math.floor((new Date().getTime() - record.scheduledDate.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={record.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{child?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {vaccine?.vaccineName} (Dose {vaccine?.doseNumber})
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          {daysOverdue} days overdue (Due: {record.scheduledDate.toLocaleDateString()})
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                          <Syringe className="h-4 w-4 mr-1" />
                          Record Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {overdueVaccinations.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No overdue vaccinations</h3>
                    <p className="text-muted-foreground">
                      All children are up to date with their immunization schedule.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="national" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>National Immunization Schedule</CardTitle>
              <CardDescription>
                Standard vaccination schedule for children under 1 year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Age</TableHead>
                      <TableHead>Vaccine</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VACCINE_SCHEDULE.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell className="font-medium">
                          {vaccine.ageInWeeks === 0 ? 'Birth' : `${vaccine.ageInWeeks} weeks`}
                        </TableCell>
                        <TableCell>{vaccine.vaccineName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Dose {vaccine.doseNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{vaccine.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
