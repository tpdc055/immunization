'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Building2,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowLeft
} from 'lucide-react';
import { getDistrictsByProvince, getDistrictById, calculateDistrictPerformance, DistrictData } from '@/lib/district-data';
import { PNG_PROVINCES } from '@/lib/geographic-data';

interface DistrictBreakdownProps {
  provinceId: string;
  onDistrictSelect?: (districtId: string) => void;
  onBack?: () => void;
}

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

export default function DistrictBreakdown({ provinceId, onDistrictSelect, onBack }: DistrictBreakdownProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'coverage' | 'children' | 'budget'>('coverage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const province = PNG_PROVINCES.find(p => p.id === provinceId);
  const districts = getDistrictsByProvince(provinceId);
  const selectedDistrictData = selectedDistrict ? getDistrictById(selectedDistrict) : null;

  if (!province) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>Province not found</AlertDescription>
      </Alert>
    );
  }

  // Calculate provincial totals from districts
  const provincialTotals = districts.reduce((acc, district) => ({
    totalChildren: acc.totalChildren + district.children.total,
    fullyImmunized: acc.fullyImmunized + district.children.fullyImmunized,
    totalFacilities: acc.totalFacilities + district.facilities,
    totalBudget: acc.totalBudget + district.budget.allocated,
    totalSpent: acc.totalSpent + district.budget.spent,
  }), { totalChildren: 0, fullyImmunized: 0, totalFacilities: 0, totalBudget: 0, totalSpent: 0 });

  const provincialCoverage = Math.round((provincialTotals.fullyImmunized / provincialTotals.totalChildren) * 100);
  const provincialBudgetUtilization = Math.round((provincialTotals.totalSpent / provincialTotals.totalBudget) * 100);

  // Sort districts
  const sortedDistricts = [...districts].sort((a, b) => {
    let aValue: number, bValue: number;

    switch (sortBy) {
      case 'coverage':
        aValue = a.coverage.overall;
        bValue = b.coverage.overall;
        break;
      case 'children':
        aValue = a.children.total;
        bValue = b.children.total;
        break;
      case 'budget':
        aValue = a.budget.utilization;
        bValue = b.budget.utilization;
        break;
      default:
        aValue = a.coverage.overall;
        bValue = b.coverage.overall;
    }

    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrict(districtId);
    if (onDistrictSelect) {
      onDistrictSelect(districtId);
    }
  };

  const toggleSort = (field: 'coverage' | 'children' | 'budget') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Provinces
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{province.name}</h2>
            <p className="text-gray-600">District-Level Immunization Breakdown</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {districts.length} Districts
        </Badge>
      </div>

      {/* Provincial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Children"
          value={provincialTotals.totalChildren.toLocaleString()}
          description="Across all districts"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Provincial Coverage"
          value={`${provincialCoverage}%`}
          description="Fully immunized"
          icon={Target}
          trend="up"
          color="green"
        />
        <StatCard
          title="Total Facilities"
          value={provincialTotals.totalFacilities}
          description="Health facilities"
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Budget Utilization"
          value={`${provincialBudgetUtilization}%`}
          description="Of allocated funds"
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* District Selection */}
      {!selectedDistrict && (
        <>
          {/* Sorting Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'coverage' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('coverage')}
                className="flex items-center gap-1"
              >
                Coverage
                {sortBy === 'coverage' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === 'children' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('children')}
                className="flex items-center gap-1"
              >
                Children
                {sortBy === 'children' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortBy === 'budget' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleSort('budget')}
                className="flex items-center gap-1"
              >
                Budget
                {sortBy === 'budget' && (
                  sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Districts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDistricts.map((district) => {
              const performance = calculateDistrictPerformance(district.id);
              const coverage = Math.round(district.coverage.overall);
              const coverageColor = coverage >= 95 ? 'green' : coverage >= 85 ? 'blue' : coverage >= 75 ? 'yellow' : coverage >= 65 ? 'orange' : 'red';

              return (
                <Card
                  key={district.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4"
                  style={{ borderLeftColor:
                    coverageColor === 'green' ? '#10b981' :
                    coverageColor === 'blue' ? '#3b82f6' :
                    coverageColor === 'yellow' ? '#eab308' :
                    coverageColor === 'orange' ? '#f97316' : '#ef4444'
                  }}
                  onClick={() => handleDistrictClick(district.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{district.name}</h3>
                      <Badge
                        variant="secondary"
                        className={`${
                          coverageColor === 'green' ? 'bg-green-100 text-green-700' :
                          coverageColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                          coverageColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                          coverageColor === 'orange' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {coverage}%
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Children:</span>
                        <span className="font-medium">{district.children.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facilities:</span>
                        <span className="font-medium">{district.facilities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget Use:</span>
                        <span className="font-medium">{district.budget.utilization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Performance:</span>
                        <Badge variant="outline" className="text-xs">
                          {performance.overallRating}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Selected District Details */}
      {selectedDistrict && selectedDistrictData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedDistrictData.name} District</h3>
              <p className="text-gray-600">Detailed immunization statistics and performance</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedDistrict(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Districts
            </Button>
          </div>

          {/* District Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Children Registered"
              value={selectedDistrictData.children.total.toLocaleString()}
              description="In this district"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Coverage Rate"
              value={`${Math.round(selectedDistrictData.coverage.overall)}%`}
              description="Fully immunized"
              icon={Target}
              trend="up"
              color="green"
            />
            <StatCard
              title="Health Facilities"
              value={selectedDistrictData.facilities}
              description="Active facilities"
              icon={Building2}
              color="purple"
            />
            <StatCard
              title="Budget Used"
              value={`${selectedDistrictData.budget.utilization}%`}
              description="Of allocated budget"
              icon={DollarSign}
              color="orange"
            />
          </div>

          {/* Detailed District Stats */}
          <Tabs defaultValue="coverage" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coverage">Immunization Coverage</TabsTrigger>
              <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
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
                          {selectedDistrictData.children.fullyImmunized} ({Math.round(selectedDistrictData.coverage.overall)}%)
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Partially Immunized</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {selectedDistrictData.children.partiallyImmunized}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Not Started</span>
                        <Badge className="bg-red-100 text-red-800">
                          {selectedDistrictData.children.notStarted}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Overdue</span>
                        <Badge className="bg-orange-100 text-orange-800">
                          {selectedDistrictData.children.overdue}
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
                      {[
                        { name: 'BCG', coverage: selectedDistrictData.coverage.bcg },
                        { name: 'DPT 1', coverage: selectedDistrictData.coverage.dpt1 },
                        { name: 'DPT 2', coverage: selectedDistrictData.coverage.dpt2 },
                        { name: 'DPT 3', coverage: selectedDistrictData.coverage.dpt3 },
                        { name: 'Measles', coverage: selectedDistrictData.coverage.measles },
                      ].map((vaccine) => (
                        <div key={vaccine.name} className="flex justify-between items-center">
                          <span className="text-sm">{vaccine.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{vaccine.coverage.toFixed(1)}%</span>
                            <Badge
                              variant="secondary"
                              className={
                                vaccine.coverage >= 95 ? "bg-green-100 text-green-700" :
                                vaccine.coverage >= 85 ? "bg-blue-100 text-blue-700" :
                                vaccine.coverage >= 75 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }
                            >
                              {vaccine.coverage >= 95 ? "Excellent" :
                               vaccine.coverage >= 85 ? "Good" :
                               vaccine.coverage >= 75 ? "Fair" : "Needs Improvement"}
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
              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${selectedDistrictData.budget.allocated.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Allocated</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${selectedDistrictData.budget.spent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Spent</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ${(selectedDistrictData.budget.allocated - selectedDistrictData.budget.spent).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const performance = calculateDistrictPerformance(selectedDistrictData.id);
                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <span>Coverage Performance</span>
                            <Badge className={
                              performance.coverageLevel === 'Excellent' ? "bg-green-100 text-green-800" :
                              performance.coverageLevel === 'Good' ? "bg-blue-100 text-blue-800" :
                              performance.coverageLevel === 'Fair' ? "bg-yellow-100 text-yellow-800" :
                              performance.coverageLevel === 'Poor' ? "bg-orange-100 text-orange-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {performance.coverageLevel}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Budget Efficiency</span>
                            <Badge className={
                              performance.budgetEfficiency === 'Excellent' ? "bg-green-100 text-green-800" :
                              performance.budgetEfficiency === 'Good' ? "bg-blue-100 text-blue-800" :
                              performance.budgetEfficiency === 'Fair' ? "bg-yellow-100 text-yellow-800" :
                              performance.budgetEfficiency === 'Poor' ? "bg-orange-100 text-orange-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {performance.budgetEfficiency}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Overall Rating</span>
                            <Badge className={
                              performance.overallRating === 'Excellent' ? "bg-green-100 text-green-800" :
                              performance.overallRating === 'Good' ? "bg-blue-100 text-blue-800" :
                              performance.overallRating === 'Fair' ? "bg-yellow-100 text-yellow-800" :
                              performance.overallRating === 'Poor' ? "bg-orange-100 text-orange-800" :
                              "bg-red-100 text-red-800"
                            }>
                              {performance.overallRating}
                            </Badge>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
