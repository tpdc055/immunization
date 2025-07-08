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
  Shield,
  Plus,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Search,
  Filter,
  Settings,
  UserCheck,
  ClipboardList,
  Target,
  TrendingUp,
  Archive,
  BookOpen
} from 'lucide-react';
import { GovernanceMeeting, GovernanceActionItem, User } from '@/lib/types';

// Mock data for governance
const mockMeetings: GovernanceMeeting[] = [
  {
    id: 'GM001',
    title: 'Monthly Program Review - June 2024',
    date: new Date('2024-06-25'),
    participants: ['Dr. Sarah Williams', 'John Miller', 'Mary Johnson', 'Finance Manager'],
    agenda: [
      'Review immunization coverage statistics',
      'Budget utilization assessment',
      'Compliance audit findings',
      'Action items from previous meeting'
    ],
    decisions: [
      'Approve additional funding for outreach campaigns',
      'Implement quarterly compliance reviews',
      'Establish new KPI targets for Q3'
    ],
    actionItems: [
      {
        id: 'AI001',
        description: 'Conduct compliance audit of all health facilities',
        assignedTo: 'Dr. Sarah Williams',
        dueDate: new Date('2024-07-15'),
        status: 'in-progress',
        priority: 'high',
      },
      {
        id: 'AI002',
        description: 'Prepare quarterly donor report',
        assignedTo: 'Finance Manager',
        dueDate: new Date('2024-07-10'),
        status: 'completed',
        priority: 'medium',
      }
    ],
    meetingMinutes: 'Meeting focused on improving immunization coverage in rural areas...',
    nextMeetingDate: new Date('2024-07-25'),
  },
  {
    id: 'GM002',
    title: 'Budget Review Committee Meeting',
    date: new Date('2024-06-15'),
    participants: ['Finance Manager', 'Program Director', 'Audit Officer'],
    agenda: [
      'Q2 budget performance review',
      'Expense approval protocols',
      'Budget constraint violations'
    ],
    decisions: [
      'Approve revised spending limits for administration',
      'Implement enhanced expense documentation requirements'
    ],
    actionItems: [
      {
        id: 'AI003',
        description: 'Update expense approval workflow',
        assignedTo: 'Finance Manager',
        dueDate: new Date('2024-07-01'),
        status: 'pending',
        priority: 'medium',
      }
    ],
    nextMeetingDate: new Date('2024-07-15'),
  },
];

const mockAuditLogs = [
  {
    id: 'AL001',
    timestamp: new Date('2024-06-25T14:30:00'),
    user: 'Dr. Sarah Williams',
    action: 'Created Meeting',
    entity: 'Governance Meeting',
    entityId: 'GM001',
    details: 'Monthly Program Review - June 2024',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'AL002',
    timestamp: new Date('2024-06-25T15:45:00'),
    user: 'Finance Manager',
    action: 'Updated Budget',
    entity: 'Budget Allocation',
    entityId: 'BA001',
    details: 'Increased personnel allocation by 5%',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'AL003',
    timestamp: new Date('2024-06-24T09:15:00'),
    user: 'Health Worker',
    action: 'Recorded Vaccination',
    entity: 'Vaccine Record',
    entityId: 'VR001',
    details: 'BCG vaccination for CHD001',
    ipAddress: '192.168.1.110',
  },
];

const MeetingForm = ({ onSubmit }: { onSubmit: (meeting: Partial<GovernanceMeeting>) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    participants: [''],
    agenda: [''],
    nextMeetingDate: '',
  });

  const addParticipant = () => {
    setFormData({ ...formData, participants: [...formData.participants, ''] });
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData({ ...formData, participants: newParticipants });
  };

  const removeParticipant = (index: number) => {
    const newParticipants = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: newParticipants });
  };

  const addAgendaItem = () => {
    setFormData({ ...formData, agenda: [...formData.agenda, ''] });
  };

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData({ ...formData, agenda: newAgenda });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: newAgenda });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const meetingDateTime = new Date(`${formData.date}T${formData.time}`);

    onSubmit({
      ...formData,
      date: meetingDateTime,
      nextMeetingDate: formData.nextMeetingDate ? new Date(formData.nextMeetingDate) : undefined,
      participants: formData.participants.filter(p => p.trim() !== ''),
      agenda: formData.agenda.filter(a => a.trim() !== ''),
      decisions: [],
      actionItems: [],
      id: `GM${Math.random().toString().slice(2, 5)}`,
    });

    // Reset form
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      participants: [''],
      agenda: [''],
      nextMeetingDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Monthly Program Review"
            required
          />
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

        <div className="space-y-2">
          <Label htmlFor="nextMeetingDate">Next Meeting Date</Label>
          <Input
            id="nextMeetingDate"
            type="date"
            value={formData.nextMeetingDate}
            onChange={(e) => setFormData({ ...formData, nextMeetingDate: e.target.value })}
          />
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Participants *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addParticipant}>
            <Plus className="h-4 w-4 mr-1" />
            Add Participant
          </Button>
        </div>
        {formData.participants.map((participant, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={participant}
              onChange={(e) => updateParticipant(index, e.target.value)}
              placeholder="Participant name"
              required={index === 0}
            />
            {formData.participants.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeParticipant(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Agenda */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Agenda Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
        {formData.agenda.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateAgendaItem(index, e.target.value)}
              placeholder="Agenda item"
              required={index === 0}
            />
            {formData.agenda.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAgendaItem(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
    </form>
  );
};

const ActionItemForm = ({ onSubmit }: { onSubmit: (actionItem: Partial<GovernanceActionItem>) => void }) => {
  const [formData, setFormData] = useState({
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      priority: formData.priority as 'low' | 'medium' | 'high' | 'critical',
      dueDate: new Date(formData.dueDate),
      status: 'pending',
      id: `AI${Math.random().toString().slice(2, 5)}`,
    });

    setFormData({
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Action Item Description *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To *</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Sarah Williams">Dr. Sarah Williams</SelectItem>
              <SelectItem value="Finance Manager">Finance Manager</SelectItem>
              <SelectItem value="Program Director">Program Director</SelectItem>
              <SelectItem value="Health Worker">Health Worker</SelectItem>
              <SelectItem value="Audit Officer">Audit Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <ClipboardList className="h-4 w-4 mr-2" />
          Create Action Item
        </Button>
      </div>
    </form>
  );
};

export default function GovernancePage() {
  const [meetings, setMeetings] = useState<GovernanceMeeting[]>(mockMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);

  const handleMeetingSubmit = (newMeeting: Partial<GovernanceMeeting>) => {
    setMeetings([newMeeting as GovernanceMeeting, ...meetings]);
    setShowMeetingForm(false);
  };

  const handleActionSubmit = (newAction: Partial<GovernanceActionItem>) => {
    // Add to the most recent meeting
    if (meetings.length > 0) {
      const updatedMeetings = [...meetings];
      updatedMeetings[0].actionItems.push(newAction as GovernanceActionItem);
      setMeetings(updatedMeetings);
    }
    setShowActionForm(false);
  };

  // Get all action items from all meetings
  const allActionItems = meetings.flatMap(meeting => meeting.actionItems);

  // Calculate statistics
  const stats = {
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter(m => m.nextMeetingDate && m.nextMeetingDate > new Date()).length,
    totalActionItems: allActionItems.length,
    pendingActions: allActionItems.filter(a => a.status === 'pending').length,
    overdueActions: allActionItems.filter(a => a.status !== 'completed' && a.dueDate < new Date()).length,
    completedActions: allActionItems.filter(a => a.status === 'completed').length,
    complianceScore: 92.3, // Mock compliance score
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governance</h1>
          <p className="text-muted-foreground">
            Meeting management, decision tracking, and compliance monitoring
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={showActionForm} onOpenChange={setShowActionForm}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClipboardList className="h-4 w-4 mr-2" />
                Add Action Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Action Item</DialogTitle>
                <DialogDescription>
                  Add a new action item with assignee and due date.
                </DialogDescription>
              </DialogHeader>
              <ActionItemForm onSubmit={handleActionSubmit} />
            </DialogContent>
          </Dialog>

          <Dialog open={showMeetingForm} onOpenChange={setShowMeetingForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Meeting</DialogTitle>
                <DialogDescription>
                  Create a new governance meeting with agenda and participants.
                </DialogDescription>
              </DialogHeader>
              <MeetingForm onSubmit={handleMeetingSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingMeetings} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActionItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingActions} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueActions}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              Governance compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.overdueActions > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>{stats.overdueActions} action item(s) are overdue.</strong> Review and update the status or extend deadlines as needed.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="meetings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meetings">Meetings ({stats.totalMeetings})</TabsTrigger>
          <TabsTrigger value="actions">Action Items ({stats.totalActionItems})</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, participant, or agenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Meetings List */}
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{meeting.title}</CardTitle>
                      <CardDescription>
                        {meeting.date.toLocaleDateString()} • {meeting.participants.length} participants
                      </CardDescription>
                    </div>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Participants</h4>
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants.slice(0, 3).map((participant, index) => (
                          <Badge key={index} variant="outline">
                            {participant}
                          </Badge>
                        ))}
                        {meeting.participants.length > 3 && (
                          <Badge variant="outline">
                            +{meeting.participants.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Action Items</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Total: {meeting.actionItems.length}</span>
                          <span>Completed: {meeting.actionItems.filter(a => a.status === 'completed').length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${meeting.actionItems.length > 0 ?
                                (meeting.actionItems.filter(a => a.status === 'completed').length / meeting.actionItems.length) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Decisions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {meeting.decisions.slice(0, 2).map((decision, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {decision}
                        </li>
                      ))}
                      {meeting.decisions.length > 2 && (
                        <li className="text-xs text-muted-foreground">
                          +{meeting.decisions.length - 2} more decisions
                        </li>
                      )}
                    </ul>
                  </div>

                  {meeting.nextMeetingDate && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center text-sm text-blue-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Next meeting: {meeting.nextMeetingDate.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Action Items Overview</CardTitle>
              <CardDescription>
                Track progress on decisions and commitments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allActionItems.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell>
                          <div className="font-medium">{action.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{action.assignedTo}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={action.dueDate < new Date() && action.status !== 'completed' ? 'text-red-600 font-medium' : ''}>
                            {action.dueDate.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            action.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            action.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {action.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            action.status === 'completed' ? 'bg-green-100 text-green-800' :
                            action.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            action.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {action.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
                <CardDescription>
                  Key governance and compliance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Meeting Frequency</span>
                      <span className="font-medium text-green-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Action Item Completion</span>
                      <span className="font-medium text-yellow-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Compliance</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Documentation</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>
                  Current compliance standing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {stats.complianceScore}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Overall Compliance Score
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Meeting Minutes</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">Compliant</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">Budget Reviews</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">Compliant</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm">Action Items</span>
                      </div>
                      <span className="text-sm font-medium text-yellow-600">Attention Needed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Audit Trail</CardTitle>
              <CardDescription>
                Complete log of system activities and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAuditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            {log.timestamp.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.user}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            log.action.includes('Created') ? 'bg-green-100 text-green-800' :
                            log.action.includes('Updated') ? 'bg-blue-100 text-blue-800' :
                            log.action.includes('Deleted') ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.ipAddress}</TableCell>
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
