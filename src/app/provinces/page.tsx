'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  MapPin,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Map,
  Activity,
  Download,
  FileText,
  FileSpreadsheet,
  Layers,
  Zap
} from 'lucide-react';
import { PNG_PROVINCES } from '@/lib/geographic-data';
import PNGInteractiveMap from '@/components/PNGInteractiveMap';
import {
  ProvincialCoverageChart,
  CoverageTrendChart,
  BudgetAllocationChart,
  VaccinePerformanceChart,
  RegionalPerformanceChart,
  PerformanceMetricsChart
} from '@/components/ChartComponents';
import DistrictBreakdown from '@/components/DistrictBreakdown';
import RealTimeDashboard from '@/components/RealTimeDashboard';
import { PDFExporter, ExcelExporter, downloadFile, generateFileName } from '@/lib/export-utils';

// Mock statistics data for provinces
const generateProvinceStats = (province: any) => ({
  provinceId: province.id,
  provinceName: province.name,
  totalChildren: province.children.total,
  totalFacilities: province.facilities,
  immunizationCoverage: {
    fullyCovered: province.children.fullyImmunized,
    partiallyCovered: province.children.partiallyImmunized,
    notCovered: province.children.notStarted,
    coveragePercentage: Math.round((province.children.fullyImmunized / province.children.total) * 100),
  },
  budgetUtilization: {
    allocated: province.budget.allocated,
    spent: province.budget.spent,
    remaining: province.budget.allocated - province.budget.spent,
    utilizationPercentage: province.budget.utilization,
  },
  vaccinePerformance: [
    { vaccineName: 'BCG', coverageRate: province.coverage.bcg, dropoutRate: Math.random() * 5 },
    { vaccineName: 'DPT 1', coverageRate: province.coverage.dpt1, dropoutRate: Math.random() * 5 },
    { vaccineName: 'DPT 2', coverageRate: province.coverage.dpt2, dropoutRate: Math.random() * 5 },
    { vaccineName: 'DPT 3', coverageRate: province.coverage.dpt3, dropoutRate: Math.random() * 5 },
    { vaccineName: 'Measles', coverageRate: province.coverage.measles, dropoutRate: Math.random() * 5 },
  ],
  activitiesThisMonth: Math.floor(Math.random() * 20) + 5,
  lastUpdated: new Date(),
});

// National summary calculation
const calculateNationalStats = () => {
  const totalChildren = PNG_PROVINCES.reduce((sum, p) => sum + p.children.total, 0);
  const totalFacilities = PNG_PROVINCES.reduce((sum, p) => sum + p.facilities, 0);
  const totalFullyImmunized = PNG_PROVINCES.reduce((sum, p) => sum + p.children.fullyImmunized, 0);
  const totalBudgetAllocated = PNG_PROVINCES.reduce((sum, p) => sum + p.budget.allocated, 0);
  const totalBudgetSpent = PNG_PROVINCES.reduce((sum, p) => sum + p.budget.spent, 0);

  return {
    totalChildren,
    totalFacilities,
    totalProvinces: PNG_PROVINCES.length,
    overallCoverage: Math.round((totalFullyImmunized / totalChildren) * 100),
    budgetUtilization: Math.round((totalBudgetSpent / totalBudgetAllocated) * 100),
    topPerformingProvinces: PNG_PROVINCES
      .map(p => ({
        provinceId: p.id,
        provinceName: p.name,
        coverageRate: Math.round((p.children.fullyImmunized / p.children.total) * 100),
        rank: 0
      }))
      .sort((a, b) => b.coverageRate - a.coverageRate)
      .slice(0, 5)
      .map((p, index) => ({ ...p, rank: index + 1 })),
    lowPerformingProvinces: PNG_PROVINCES
      .map(p => ({
        provinceId: p.id,
        provinceName: p.name,
        coverageRate: Math.round((p.children.fullyImmunized / p.children.total) * 100),
        rank: 0
      }))
      .sort((a, b) => a.coverageRate - b.coverageRate)
      .slice(0, 5)
      .map((p, index) => ({ ...p, rank: index + 1 })),
    recentActivities: PNG_PROVINCES.reduce((sum, p) => sum + Math.floor(Math.random() * 20) + 5, 0),
    alertsCount: Math.floor(Math.random() * 15) + 5,
    lastUpdated: new Date(),
  };
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue"
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  color?: string;
}) => (
  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className={`h-2 bg-gradient-to-r from-${color}-500 to-${color}-600`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className={`h-5 w-5 text-${color}-600`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="flex items-center text-xs text-gray-500 mt-1">
        {trend && (
          <>
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
          </>
        )}
        <span>{description}</span>
      </div>
    </CardContent>
  </Card>
);

export default function ProvincesPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>('national');
  const [view, setView] = useState<'overview' | 'districts' | 'realtime'>('overview');
  const [isExporting, setIsExporting] = useState(false);

  const nationalStats = calculateNationalStats();
  const currentStats = selectedProvince === 'national'
    ? null
    : generateProvinceStats(PNG_PROVINCES.find(p => p.id === selectedProvince));

  // Export functions
  const handlePDFExport = async (type: 'summary' | 'detailed') => {
    setIsExporting(true);
    try {
      const pdfExporter = new PDFExporter();
      const blob = selectedProvince === 'national' || type === 'summary'
        ? await pdfExporter.generateProvincialSummary(selectedProvince === 'national' ? undefined : selectedProvince)
        : await pdfExporter.generateDetailedReport(selectedProvince);

      const filename = generateFileName(
        'pdf',
        type === 'summary' ? 'Summary' : 'Detailed',
        selectedProvince === 'national' ? undefined : currentStats?.provinceName
      );
      downloadFile(blob, filename);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExcelExport = (type: 'summary' | 'detailed') => {
    setIsExporting(true);
    try {
      const excelExporter = new ExcelExporter();
      const blob = type === 'summary'
        ? excelExporter.generateProvincialSummary(selectedProvince === 'national' ? undefined : selectedProvince)
        : excelExporter.generateDetailedReport(selectedProvince);

      const filename = generateFileName(
        'excel',
        type === 'summary' ? 'Summary' : 'Detailed',
        selectedProvince === 'national' ? undefined : currentStats?.provinceName
      );
      downloadFile(blob, filename);
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleProvinceSelect = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setView('overview');
  };

  const handleDistrictView = () => {
    if (selectedProvince !== 'national') {
      setView('districts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Papua New Guinea - Advanced Provincial Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive immunization monitoring with real-time data, interactive maps, and detailed analytics
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={view === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('overview')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={view === 'districts' ? 'default' : 'outline'}
                size="sm"
                onClick={handleDistrictView}
                disabled={selectedProvince === 'national'}
              >
                <Layers className="h-4 w-4 mr-2" />
                Districts
              </Button>
              <Button
                variant={view === 'realtime' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('realtime')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Real-Time
              </Button>
            </div>

            {/* Province Selector */}
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">🇵🇬 National Overview</SelectItem>
                {PNG_PROVINCES.map((province) => (
                  <SelectItem key={province.id} value={province.id}>
                    📍 {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Export Options */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePDFExport('summary')}
                disabled={isExporting}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExcelExport('summary')}
                disabled={isExporting}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              {selectedProvince !== 'national' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePDFExport('detailed')}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Detailed
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Real-Time Dashboard View */}
        {view === 'realtime' && (
          <RealTimeDashboard />
        )}

        {/* Districts View */}
        {view === 'districts' && selectedProvince !== 'national' && (
          <DistrictBreakdown
            provinceId={selectedProvince}
            onBack={() => setView('overview')}
          />
        )}

        {/* Overview Content */}
        {view === 'overview' && (
          <>
            {/* National Overview */}
            {selectedProvince === 'national' && (
              <>
                {/* National Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Children"
                    value={nationalStats.totalChildren.toLocaleString()}
                    description="Registered nationwide"
                    icon={Users}
                    color="blue"
                  />
                  <StatCard
                    title="Overall Coverage"
                    value={`${nationalStats.overallCoverage}%`}
                    description="Fully immunized"
                    icon={Target}
                    trend="up"
                    color="green"
                  />
                  <StatCard
                    title="Total Facilities"
                    value={nationalStats.totalFacilities}
                    description="Health facilities"
                    icon={Building2}
                    color="purple"
                  />
                  <StatCard
                    title="Budget Utilization"
                    value={`${nationalStats.budgetUtilization}%`}
                    description="Of allocated funds"
                    icon={DollarSign}
                    color="orange"
                  />
                </div>

                {/* Interactive Map and Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PNGInteractiveMap
                    onProvinceSelect={handleProvinceSelect}
                    selectedProvince={selectedProvince}
                    showCoverageData={true}
                  />
                  <ProvincialCoverageChart
                    title="Provincial Coverage Comparison"
                    description="Immunization coverage rates by province"
                  />
                </div>

                {/* Advanced Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CoverageTrendChart
                    title="Coverage Trends by Region"
                    description="Historical coverage data over time"
                  />
                  <BudgetAllocationChart
                    title="National Budget Allocation"
                    description="Distribution of immunization program funds"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VaccinePerformanceChart
                    title="Vaccine-Specific Performance"
                    description="Coverage rates by vaccine type"
                  />
                  <RegionalPerformanceChart
                    title="Regional Performance Analysis"
                    description="Comparative analysis across regions"
                  />
                </div>

                {/* Performance Rankings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Top Performing Provinces
                      </CardTitle>
                      <CardDescription>Highest immunization coverage rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nationalStats.topPerformingProvinces.map((province, index) => (
                          <div key={province.provinceId} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => handleProvinceSelect(province.provinceId)}>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                #{province.rank}
                              </Badge>
                              <span className="font-medium">{province.provinceName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-green-700">{province.coverageRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Provinces Needing Support
                      </CardTitle>
                      <CardDescription>Lower coverage rates requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nationalStats.lowPerformingProvinces.map((province, index) => (
                          <div key={province.provinceId} className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => handleProvinceSelect(province.provinceId)}>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="bg-red-100 text-red-700">
                                ⚠️
                              </Badge>
                              <span className="font-medium">{province.provinceName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <span className="font-bold text-red-700">{province.coverageRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Comprehensive Performance Metrics */}
                <PerformanceMetricsChart
                  title="Comprehensive Performance Dashboard"
                  description="Multi-metric analysis of provincial performance"
                />
              </>
            )}

            {/* Province-Specific View */}
            {selectedProvince !== 'national' && currentStats && (
              <>
                {/* Province Header */}
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{currentStats.provinceName}</strong> - Comprehensive immunization analytics with district breakdown available
                  </AlertDescription>
                </Alert>

                {/* Province Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Children Registered"
                    value={currentStats.totalChildren.toLocaleString()}
                    description="In this province"
                    icon={Users}
                    color="blue"
                  />
                  <StatCard
                    title="Coverage Rate"
                    value={`${currentStats.immunizationCoverage.coveragePercentage}%`}
                    description="Fully immunized"
                    icon={Target}
                    trend="up"
                    color="green"
                  />
                  <StatCard
                    title="Health Facilities"
                    value={currentStats.totalFacilities}
                    description="Active facilities"
                    icon={Building2}
                    color="purple"
                  />
                  <StatCard
                    title="Budget Used"
                    value={`${currentStats.budgetUtilization.utilizationPercentage}%`}
                    description="Of allocated budget"
                    icon={DollarSign}
                    color="orange"
                  />
                </div>

                {/* Enhanced Province Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Map showing selected province */}
                  <PNGInteractiveMap
                    onProvinceSelect={handleProvinceSelect}
                    selectedProvince={selectedProvince}
                    showCoverageData={true}
                  />

                  {/* Vaccine Performance Chart */}
                  <VaccinePerformanceChart
                    title="Vaccine Coverage Breakdown"
                    description="Performance by vaccine type"
                  />
                </div>

                {/* Detailed Province Stats */}
                <Tabs defaultValue="coverage" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="coverage">Immunization Coverage</TabsTrigger>
                    <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
                    <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
                    <TabsTrigger value="districts">District Breakdown</TabsTrigger>
                  </TabsList>

                  <TabsContent value="coverage" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Coverage Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>Fully Immunized</span>
                              <Badge className="bg-green-100 text-green-800">
                                {currentStats.immunizationCoverage.fullyCovered} ({currentStats.immunizationCoverage.coveragePercentage}%)
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Partially Immunized</span>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {currentStats.immunizationCoverage.partiallyCovered}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Not Started</span>
                              <Badge className="bg-red-100 text-red-800">
                                {currentStats.immunizationCoverage.notCovered}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Vaccine-Specific Coverage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {currentStats.vaccinePerformance.map((vaccine) => (
                              <div key={vaccine.vaccineName} className="flex justify-between items-center">
                                <span className="text-sm">{vaccine.vaccineName}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{vaccine.coverageRate.toFixed(1)}%</span>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      vaccine.coverageRate >= 95 ? "bg-green-100 text-green-700" :
                                      vaccine.coverageRate >= 85 ? "bg-yellow-100 text-yellow-700" :
                                      "bg-red-100 text-red-700"
                                    }
                                  >
                                    {vaccine.coverageRate >= 95 ? "Excellent" :
                                     vaccine.coverageRate >= 85 ? "Good" : "Needs Improvement"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="budget" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Budget Utilization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                ${currentStats.budgetUtilization.allocated.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Allocated</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                ${currentStats.budgetUtilization.spent.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Spent</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                              <div className="text-2xl font-bold text-orange-600">
                                ${currentStats.budgetUtilization.remaining.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Remaining</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <BudgetAllocationChart
                        title="Budget Distribution"
                        description="Provincial budget allocation breakdown"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Performance Indicators</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>Overall Coverage Rate</span>
                              <Badge className={
                                currentStats.immunizationCoverage.coveragePercentage >= 95 ? "bg-green-100 text-green-800" :
                                currentStats.immunizationCoverage.coveragePercentage >= 80 ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {currentStats.immunizationCoverage.coveragePercentage}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Budget Efficiency</span>
                              <Badge className="bg-blue-100 text-blue-800">
                                {currentStats.budgetUtilization.utilizationPercentage}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Activities This Month</span>
                              <Badge className="bg-purple-100 text-purple-800">
                                {currentStats.activitiesThisMonth}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                              <Activity className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Vaccination campaign completed</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Cold chain monitoring updated</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                              <BarChart3 className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">Monthly report generated</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="districts" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>District-Level Analysis</span>
                          <Button
                            onClick={() => setView('districts')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Layers className="h-4 w-4 mr-2" />
                            View Full District Breakdown
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Drill down into district-level immunization data for detailed analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                            <Layers className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">District Views</h3>
                            <p className="text-sm text-blue-700 mt-1">Detailed statistics for each district</p>
                          </div>
                          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                            <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h3 className="font-semibold text-green-900">Performance Tracking</h3>
                            <p className="text-sm text-green-700 mt-1">Compare district performance</p>
                          </div>
                          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <h3 className="font-semibold text-purple-900">Drill-Down Analysis</h3>
                            <p className="text-sm text-purple-700 mt-1">Granular data insights</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
