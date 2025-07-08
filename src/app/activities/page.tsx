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
  Activity,
  Plus,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  UserCheck,
  School,
  Megaphone,
  Stethoscope,
  FileText
} from 'lucide-react';
import { Activity as ActivityType } from '@/lib/types';
import { BUDGET_CATEGORIES } from '@/lib/constants';

// Mock data for activities
const mockActivities: ActivityType[] = [
  {
    id: 'ACT001',
    name: 'Community Immunization Campaign - Ward 5',
    type: 'campaign',
    date: new Date('2024-06-20'),
    location: 'Ward 5 Community Center',
    plannedParticipants: 150,
    actualParticipants: 142,
    cost: 12500,
    categoryId: 'community-outreach',
    budgetId: 'BUD2024001',
    attendingChildren: ['CHD001', 'CHD002', 'CHD003'],
    officerInCharge: 'Dr. Sarah Williams',
    notes: 'High community engagement, need more vaccine supplies for next campaign',
    geoLocation: {
      latitude: -9.4438,
      longitude: 147.1803,
    },
  },
  {
    id: 'ACT002',
    name: 'Health Worker Training - Vaccine Storage',
    type: 'training',
    date: new Date('2024-06-15'),
    location: 'Port Moresby General Hospital',
    plannedParticipants: 25,
    actualParticipants: 28,
    cost: 8500,
    categoryId: 'advocacy-training',
    budgetId: 'BUD2024001',
    attendingChildren: [],
    officerInCharge: 'Training Coordinator',
    notes: 'Exceeded planned attendance, positive feedback on cold chain management',
  },
  {
    id: 'ACT003',
    name: 'Door-to-Door Outreach - Remote Villages',
    type: 'outreach',
    date: new Date('2024-06-25'),
    location: 'Mendi District Remote Villages',
    plannedParticipants: 75,
    actualParticipants: 68,
    cost: 15000,
    categoryId: 'community-outreach',
    budgetId: 'BUD2024001',
    attendingChildren: ['CHD004', 'CHD005'],
    officerInCharge: 'Mobile Health Team',
    notes: 'Challenging terrain but good community response',
    geoLocation: {
      latitude: -6.1477,
      longitude: 143.6569,
    },
  },
  {
    id: 'ACT004',
    name: 'Monthly Program Review Meeting',
    type: 'meeting',
    date: new Date('2024-06-30'),
    location: 'Program Office',
    plannedParticipants: 12,
    actualParticipants: 12,
    cost: 2500,
    categoryId: 'monitoring-evaluation',
    budgetId: 'BUD2024001',
    attendingChildren: [],
    officerInCharge: 'Program Manager',
    notes: 'Reviewed Q2 performance metrics',
  },
];

const ActivityForm = ({ onSubmit }: { onSubmit: (activity: Partial<ActivityType>) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'outreach',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    plannedParticipants: '',
    cost: '',
    categoryId: 'community-outreach',
    officerInCharge: '',
    notes: '',
    geoLatitude: '',
    geoLongitude: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activityDateTime = new Date(`${formData.date}T${formData.time}`);

    onSubmit({
      ...formData,
      type: formData.type as 'outreach' | 'campaign' | 'training' | 'meeting' | 'other',
      date: activityDateTime,
      plannedParticipants: parseInt(formData.plannedParticipants),
      cost: parseFloat(formData.cost),
      actualParticipants: 0,
      attendingChildren: [],
      budgetId: 'BUD2024001',
      geoLocation: formData.geoLatitude && formData.geoLongitude ? {
        latitude: parseFloat(formData.geoLatitude),
        longitude: parseFloat(formData.geoLongitude),
      } : undefined,
      id: `ACT${Math.random().toString().slice(2, 5)}`,
    });

    // Reset form
    setFormData({
      name: '',
      type: 'outreach',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: '',
      plannedParticipants: '',
      cost: '',
      categoryId: 'community-outreach',
      officerInCharge: '',
      notes: '',
      geoLatitude: '',
      geoLongitude: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Activity Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Community Immunization Campaign"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Activity Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Budget Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Activity location or venue"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plannedParticipants">Planned Participants *</Label>
          <Input
            id="plannedParticipants"
            type="number"
            value={formData.plannedParticipants}
            onChange={(e) => setFormData({ ...formData, plannedParticipants: e.target.value })}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Estimated Cost (Kina) *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="officerInCharge">Officer in Charge *</Label>
          <Input
            id="officerInCharge"
            value={formData.officerInCharge}
            onChange={(e) => setFormData({ ...formData, officerInCharge: e.target.value })}
            placeholder="Name of responsible officer"
            required
          />
        </div>

        {/* GPS Coordinates */}
        <div className="space-y-2">
          <Label htmlFor="geoLatitude">Latitude (Optional)</Label>
          <Input
            id="geoLatitude"
            type="number"
            step="any"
            value={formData.geoLatitude}
            onChange={(e) => setFormData({ ...formData, geoLatitude: e.target.value })}
            placeholder="-9.4438"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="geoLongitude">Longitude (Optional)</Label>
          <Input
            id="geoLongitude"
            type="number"
            step="any"
            value={formData.geoLongitude}
            onChange={(e) => setFormData({ ...formData, geoLongitude: e.target.value })}
            placeholder="147.1803"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes or observations"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Create Activity
        </Button>
      </div>
    </form>
  );
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityType[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showActivityForm, setShowActivityForm] = useState(false);

  const handleActivitySubmit = (newActivity: Partial<ActivityType>) => {
    setActivities([newActivity as ActivityType, ...activities]);
    setShowActivityForm(false);
  };

  const filteredActivities = activities.filter(activity => {
    const category = BUDGET_CATEGORIES.find(c => c.id === activity.categoryId);

    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.officerInCharge.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesCategory = filterCategory === 'all' || activity.categoryId === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: activities.length,
    thisMonth: activities.filter(a => {
      const now = new Date();
      return a.date.getMonth() === now.getMonth() && a.date.getFullYear() === now.getFullYear();
    }).length,
    totalCost: activities.reduce((sum, a) => sum + a.cost, 0),
    totalPlannedParticipants: activities.reduce((sum, a) => sum + a.plannedParticipants, 0),
    totalActualParticipants: activities.reduce((sum, a) => sum + (a.actualParticipants || 0), 0),
    avgParticipationRate: activities.length > 0 ?
      (activities.reduce((sum, a) => sum + ((a.actualParticipants || 0) / a.plannedParticipants), 0) / activities.length) * 100 : 0,
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'outreach':
        return Megaphone;
      case 'campaign':
        return Users;
      case 'training':
        return School;
      case 'meeting':
        return FileText;
      default:
        return Activity;
    }
  };

  // Activity types breakdown
  const activityTypeStats = [
    { type: 'outreach', count: activities.filter(a => a.type === 'outreach').length, color: 'bg-blue-100 text-blue-800' },
    { type: 'campaign', count: activities.filter(a => a.type === 'campaign').length, color: 'bg-green-100 text-green-800' },
    { type: 'training', count: activities.filter(a => a.type === 'training').length, color: 'bg-purple-100 text-purple-800' },
    { type: 'meeting', count: activities.filter(a => a.type === 'meeting').length, color: 'bg-orange-100 text-orange-800' },
    { type: 'other', count: activities.filter(a => a.type === 'other').length, color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">
            Track outreach campaigns, training events, and operational activities
          </p>
        </div>

        <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
              <DialogDescription>
                Plan a new outreach, training, or operational activity.
              </DialogDescription>
            </DialogHeader>
            <ActivityForm onSubmit={handleActivitySubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{stats.totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Activity expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActualParticipants}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalPlannedParticipants} planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgParticipationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average turnout
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Activities ({stats.total})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
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
                      placeholder="Search by name, location, or officer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {BUDGET_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Activities List */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Records ({filteredActivities.length})</CardTitle>
              <CardDescription>
                Complete history of activities and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => {
                      const category = BUDGET_CATEGORIES.find(c => c.id === activity.categoryId);
                      const Icon = getActivityIcon(activity.type);
                      const participationRate = activity.actualParticipants ?
                        (activity.actualParticipants / activity.plannedParticipants) * 100 : 0;

                      return (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex items-start space-x-3">
                              <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">{activity.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {category?.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              activityTypeStats.find(s => s.type === activity.type)?.color || 'bg-gray-100 text-gray-800'
                            }>
                              {activity.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{activity.date.toLocaleDateString()}</div>
                              <div className="text-sm text-muted-foreground">
                                {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm">{activity.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {activity.actualParticipants || 0} / {activity.plannedParticipants}
                              </div>
                              {activity.actualParticipants && (
                                <div className={`text-sm ${
                                  participationRate >= 90 ? 'text-green-600' :
                                  participationRate >= 70 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {participationRate.toFixed(1)}% turnout
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            K{activity.cost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{activity.officerInCharge}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or create a new activity.
                  </p>
                  <Button onClick={() => setShowActivityForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of activities by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityTypeStats.map((stat) => (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{stat.type}</span>
                        <span>{stat.count} activities</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${stats.total > 0 ? (stat.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>
                  Activity costs by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {BUDGET_CATEGORIES.map((category) => {
                    const categoryActivities = activities.filter(a => a.categoryId === category.id);
                    const totalCost = categoryActivities.reduce((sum, a) => sum + a.cost, 0);
                    const percentage = stats.totalCost > 0 ? (totalCost / stats.totalCost) * 100 : 0;

                    if (totalCost === 0) return null;

                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span>K{totalCost.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {stats.avgParticipationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Participation Rate
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    K{(stats.totalCost / stats.total || 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Cost per Activity
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {(stats.totalActualParticipants / (stats.total || 1)).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Participants per Activity
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>
                Upcoming and recent activities in calendar view
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {activities
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .slice(0, 10)
                  .map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    const isUpcoming = activity.date > new Date();

                    return (
                      <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        isUpcoming ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isUpcoming ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isUpcoming ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.location} • {activity.officerInCharge}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            {activity.date.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge variant="outline" className={
                            isUpcoming ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }>
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
