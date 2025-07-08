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
  FileText,
  Download,
  Plus,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Shield,
  Eye,
  Edit,
  Search,
  Filter,
  FileSpreadsheet,
  File,
  Mail,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { Report } from '@/lib/types';
import { REPORT_TYPES } from '@/lib/constants';

// Mock data for reports
const mockReports: Report[] = [
  {
    id: 'RPT001',
    title: 'Monthly Immunization Coverage Report - June 2024',
    type: 'immunization_coverage',
    period: {
      start: new Date('2024-06-01'),
      end: new Date('2024-06-30'),
    },
    generatedBy: 'Dr. Sarah Williams',
    generatedDate: new Date('2024-07-01'),
    data: {
      totalChildren: 2847,
      fullyImmunized: 2395,
      coverageRate: 84.1,
      vaccineBreakdown: {
        bcg: 99.2,
        dpt1: 98.4,
        dpt2: 97.4,
        dpt3: 93.9,
        measles1: 95.6,
      },
      dropoutRates: {
        dpt1ToDpt3: 4.7,
        bcgToMeasles: 4.6,
      },
    },
    filePath: '/reports/immunization_june_2024.pdf',
    isPublic: true,
  },
  {
    id: 'RPT002',
    title: 'Budget Compliance Report - Q2 2024',
    type: 'budget_compliance',
    period: {
      start: new Date('2024-04-01'),
      end: new Date('2024-06-30'),
    },
    generatedBy: 'Finance Manager',
    generatedDate: new Date('2024-07-02'),
    data: {
      totalBudget: 1500000,
      totalSpent: 1177500,
      utilizationRate: 78.5,
      categoryCompliance: {
        personnel: { allocated: 450000, spent: 387500, compliant: true },
        vaccines: { allocated: 300000, spent: 245000, compliant: true },
        administration: { allocated: 150000, spent: 91500, compliant: true },
      },
      violations: 0,
    },
    filePath: '/reports/budget_compliance_q2_2024.xlsx',
    isPublic: false,
  },
  {
    id: 'RPT003',
    title: 'Activity Summary Report - June 2024',
    type: 'activity_summary',
    period: {
      start: new Date('2024-06-01'),
      end: new Date('2024-06-30'),
    },
    generatedBy: 'Program Manager',
    generatedDate: new Date('2024-07-03'),
    data: {
      totalActivities: 12,
      totalParticipants: 485,
      totalCost: 42500,
      byType: {
        outreach: 5,
        campaign: 3,
        training: 2,
        meeting: 2,
      },
      participationRate: 94.2,
    },
    filePath: '/reports/activity_summary_june_2024.pdf',
    isPublic: true,
  },
  {
    id: 'RPT004',
    title: 'Donor Compliance Report - Q2 2024',
    type: 'governance_report',
    period: {
      start: new Date('2024-04-01'),
      end: new Date('2024-06-30'),
    },
    generatedBy: 'Program Director',
    generatedDate: new Date('2024-07-05'),
    data: {
      complianceScore: 92.3,
      budgetUtilization: 78.5,
      targetAchievement: 84.1,
      keyMetrics: {
        immunizationCoverage: 84.1,
        budgetCompliance: 95.0,
        activityCompletion: 100.0,
        reportingCompliance: 100.0,
      },
    },
    filePath: '/reports/donor_compliance_q2_2024.pdf',
    isPublic: false,
  },
];

const ReportGenerationForm = ({ onSubmit }: { onSubmit: (report: Partial<Report>) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'immunization_coverage',
    startDate: '',
    endDate: '',
    format: 'pdf',
    isPublic: false,
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      type: formData.type as 'immunization_coverage' | 'budget_compliance' | 'activity_summary' | 'governance_report',
      period: {
        start: new Date(formData.startDate),
        end: new Date(formData.endDate),
      },
      generatedBy: 'Current User',
      generatedDate: new Date(),
      data: {},
      filePath: `/reports/${formData.type}_${Date.now()}.${formData.format}`,
      id: `RPT${Math.random().toString().slice(2, 5)}`,
    });

    // Reset form
    setFormData({
      title: '',
      type: 'immunization_coverage',
      startDate: '',
      endDate: '',
      format: 'pdf',
      isPublic: false,
      includeCharts: true,
      includeSummary: true,
      includeDetails: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Report Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Monthly Immunization Coverage Report"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Report Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immunization_coverage">Immunization Coverage</SelectItem>
              <SelectItem value="budget_compliance">Budget Compliance</SelectItem>
              <SelectItem value="activity_summary">Activity Summary</SelectItem>
              <SelectItem value="governance_report">Governance Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Output Format *</Label>
          <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Report Options */}
      <div className="space-y-3">
        <Label>Report Options</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeSummary"
              checked={formData.includeSummary}
              onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="includeSummary" className="text-sm">Include Executive Summary</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeCharts"
              checked={formData.includeCharts}
              onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="includeCharts" className="text-sm">Include Charts and Visualizations</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeDetails"
              checked={formData.includeDetails}
              onChange={(e) => setFormData({ ...formData, includeDetails: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="includeDetails" className="text-sm">Include Detailed Data Tables</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isPublic" className="text-sm">Make Report Public (for donors)</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </form>
  );
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAccess, setFilterAccess] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);

  const handleReportSubmit = (newReport: Partial<Report>) => {
    // Simulate report generation
    setReports([newReport as Report, ...reports]);
    setShowReportForm(false);

    // In a real application, this would trigger the actual report generation process
    alert(`Report "${newReport.title}" is being generated. You will receive a notification when it's ready.`);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesAccess = filterAccess === 'all' ||
                         (filterAccess === 'public' && report.isPublic) ||
                         (filterAccess === 'private' && !report.isPublic);

    return matchesSearch && matchesType && matchesAccess;
  });

  // Calculate statistics
  const stats = {
    total: reports.length,
    thisMonth: reports.filter(r => {
      const now = new Date();
      return r.generatedDate.getMonth() === now.getMonth() && r.generatedDate.getFullYear() === now.getFullYear();
    }).length,
    public: reports.filter(r => r.isPublic).length,
    private: reports.filter(r => !r.isPublic).length,
  };

  // Report types breakdown
  const reportTypeStats = [
    { type: 'immunization_coverage', label: 'Immunization Coverage', count: reports.filter(r => r.type === 'immunization_coverage').length },
    { type: 'budget_compliance', label: 'Budget Compliance', count: reports.filter(r => r.type === 'budget_compliance').length },
    { type: 'activity_summary', label: 'Activity Summary', count: reports.filter(r => r.type === 'activity_summary').length },
    { type: 'governance_report', label: 'Governance Report', count: reports.filter(r => r.type === 'governance_report').length },
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'immunization_coverage':
        return Shield;
      case 'budget_compliance':
        return DollarSign;
      case 'activity_summary':
        return BarChart3;
      case 'governance_report':
        return Target;
      default:
        return FileText;
    }
  };

  const getFormatIcon = (filePath?: string) => {
    if (!filePath) return FileText;
    if (filePath.includes('.pdf')) return File;
    if (filePath.includes('.xlsx')) return FileSpreadsheet;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and manage system reports for stakeholders and donors
          </p>
        </div>

        <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Create a custom report with specified parameters and format.
              </DialogDescription>
            </DialogHeader>
            <ReportGenerationForm onSubmit={handleReportSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonth} generated this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Reports</CardTitle>
            <Share className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.public}</div>
            <p className="text-xs text-muted-foreground">
              Available to donors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Reports</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.private}</div>
            <p className="text-xs text-muted-foreground">
              Internal use only
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Report</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {reports[0]?.generatedDate.toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {reports[0]?.title.substring(0, 30)}...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports ({stats.total})</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
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
                      placeholder="Search by title or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="immunization_coverage">Immunization Coverage</SelectItem>
                    <SelectItem value="budget_compliance">Budget Compliance</SelectItem>
                    <SelectItem value="activity_summary">Activity Summary</SelectItem>
                    <SelectItem value="governance_report">Governance Report</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterAccess} onValueChange={setFilterAccess}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports ({filteredReports.length})</CardTitle>
              <CardDescription>
                Complete history of generated reports and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => {
                      const TypeIcon = getReportIcon(report.type);
                      const FormatIcon = getFormatIcon(report.filePath);

                      return (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-start space-x-3">
                              <TypeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">{report.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  by {report.generatedBy}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{report.period.start.toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                to {report.period.end.toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{report.generatedDate.toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {report.generatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              report.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }>
                              {report.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FormatIcon className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm uppercase">
                                {report.filePath?.split('.').pop() || 'PDF'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reports found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or generate a new report.
                  </p>
                  <Button onClick={() => setShowReportForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate First Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypeStats.map((stat) => {
              const Icon = getReportIcon(stat.type);
              return (
                <Card key={stat.type}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{stat.label}</CardTitle>
                      </div>
                      <Badge variant="outline">{stat.count} reports</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {stat.type === 'immunization_coverage' && 'Track vaccination rates, coverage targets, and dropout rates across all facilities and demographics.'}
                        {stat.type === 'budget_compliance' && 'Monitor budget utilization, spending constraints, and financial compliance against donor requirements.'}
                        {stat.type === 'activity_summary' && 'Summarize outreach activities, training sessions, and operational performance metrics.'}
                        {stat.type === 'governance_report' && 'Comprehensive governance and compliance report for donors and oversight bodies.'}
                      </p>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReportForm(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated report generation on recurring schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Monthly Immunization Reports</strong> are automatically generated on the 1st of each month and shared with donors.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quarterly Budget Compliance Reports</strong> are generated every 3 months and sent to the oversight committee.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Annual Governance Reports</strong> are scheduled for year-end and include comprehensive program evaluation.
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scheduled Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Report Generators</CardTitle>
              <CardDescription>
                Generate common reports with pre-defined parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Current Month Coverage</div>
                      <div className="text-sm text-muted-foreground">Immunization coverage for current month</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Budget Status</div>
                      <div className="text-sm text-muted-foreground">Current quarter budget utilization</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">Activity Dashboard</div>
                      <div className="text-sm text-muted-foreground">Recent activities and outcomes</div>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Donor Summary</div>
                      <div className="text-sm text-muted-foreground">Comprehensive program overview</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
