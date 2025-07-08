'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Target,
  Clock
} from 'lucide-react';

// Mock data for demonstration
const dashboardData = {
  summary: {
    totalChildren: 2847,
    fullyImmunized: 2395,
    partiallyImmunized: 398,
    notStarted: 54,
    overdueVaccinations: 127,
    upcomingVaccinations: 234,
    budgetUtilization: 78.5,
    activeAlerts: 8,
    complianceScore: 92.3,
  },
  immunizationCoverage: [
    { vaccine: 'BCG', totalDoses: 2847, administeredDoses: 2823, coveragePercentage: 99.2 },
    { vaccine: 'DPT-HepB-Hib 1', totalDoses: 2847, administeredDoses: 2801, coveragePercentage: 98.4 },
    { vaccine: 'DPT-HepB-Hib 2', totalDoses: 2647, administeredDoses: 2578, coveragePercentage: 97.4 },
    { vaccine: 'DPT-HepB-Hib 3', totalDoses: 2447, administeredDoses: 2298, coveragePercentage: 93.9 },
    { vaccine: 'Measles 1', totalDoses: 1847, administeredDoses: 1765, coveragePercentage: 95.6 },
  ],
  budgetBreakdown: [
    { category: 'Personnel', allocated: 450000, spent: 387500, percentage: 30.0, isOverLimit: false },
    { category: 'Vaccines', allocated: 300000, spent: 245000, percentage: 20.0, isOverLimit: false },
    { category: 'Cold Chain', allocated: 225000, spent: 189000, percentage: 15.0, isOverLimit: false },
    { category: 'Community Outreach', allocated: 300000, spent: 198000, percentage: 20.0, isOverLimit: false },
    { category: 'M&E', allocated: 75000, spent: 67500, percentage: 5.0, isOverLimit: false },
    { category: 'Administration', allocated: 150000, spent: 91500, percentage: 10.0, isOverLimit: false },
  ],
  recentAlerts: [
    { type: 'warning', message: '127 children have overdue vaccinations', priority: 'high' },
    { type: 'info', message: 'Monthly budget review due in 3 days', priority: 'medium' },
    { type: 'warning', message: 'Cold chain monitoring needed at 5 facilities', priority: 'high' },
    { type: 'success', message: 'Quarterly coverage target achieved', priority: 'low' },
  ],
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  gradient = "from-blue-500 to-blue-600"
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  trendValue?: string;
  gradient?: string;
}) => (
  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
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
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {trendValue}
            </span>
          </>
        )}
        <span className="ml-1">{description}</span>
      </div>
    </CardContent>
  </Card>
);

const ProgressBar = ({ percentage, color = "bg-blue-500" }: { percentage: number; color?: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div
      className={`h-3 rounded-full ${color} transition-all duration-500 ease-out`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default function Dashboard() {
  const { summary, immunizationCoverage, budgetBreakdown, recentAlerts } = dashboardData;

  const coveragePercentage = Math.round((summary.fullyImmunized / summary.totalChildren) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Mission Statement */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Child Immunization Monitoring and Governance System
            </p>
            <div className="mt-3 text-sm text-blue-100">
              <span className="font-medium">Mission:</span> Ensuring 100% immunization coverage with complete transparency and accountability
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{coveragePercentage}%</div>
              <div className="text-blue-100 text-sm">Coverage Goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">K{(summary.budgetUtilization).toFixed(1)}%</div>
              <div className="text-blue-100 text-sm">Budget Used</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Children Registered"
          value={summary.totalChildren.toLocaleString()}
          description="Active registrations"
          icon={Users}
          trend="up"
          trendValue="+12%"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Fully Immunized"
          value={`${coveragePercentage}%`}
          description={`${summary.fullyImmunized} children`}
          icon={Shield}
          trend="up"
          trendValue="+2.3%"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Budget Utilization"
          value={`${summary.budgetUtilization}%`}
          description="of allocated budget"
          icon={DollarSign}
          trend="up"
          trendValue="+5.2%"
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Compliance Score"
          value={`${summary.complianceScore}%`}
          description="governance compliance"
          icon={CheckCircle}
          trend="up"
          trendValue="+1.1%"
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Alerts */}
      {summary.activeAlerts > 0 && (
        <Alert className="border-l-4 border-l-red-500 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            <strong>Urgent Action Required:</strong> You have {summary.activeAlerts} active alerts requiring attention.
            {summary.overdueVaccinations > 0 && (
              <> {summary.overdueVaccinations} children have overdue vaccinations.</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="immunization" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Immunization</TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Budget</TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Immunization Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fully Immunized</span>
                    <Badge className="bg-green-500 text-white">{summary.fullyImmunized}</Badge>
                  </div>
                  <ProgressBar percentage={(summary.fullyImmunized / summary.totalChildren) * 100} color="bg-green-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Partially Immunized</span>
                    <Badge className="bg-yellow-500 text-white">{summary.partiallyImmunized}</Badge>
                  </div>
                  <ProgressBar percentage={(summary.partiallyImmunized / summary.totalChildren) * 100} color="bg-yellow-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Not Started</span>
                    <Badge className="bg-red-500 text-white">{summary.notStarted}</Badge>
                  </div>
                  <ProgressBar percentage={(summary.notStarted / summary.totalChildren) * 100} color="bg-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Schedule Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
                  <span className="font-medium text-blue-800">Upcoming Vaccines</span>
                  <Badge className="bg-blue-500 text-white">{summary.upcomingVaccinations}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
                  <span className="font-medium text-red-800">Overdue Vaccines</span>
                  <Badge className="bg-red-500 text-white">{summary.overdueVaccinations}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                  <span className="font-medium text-green-800">On Schedule</span>
                  <Badge className="bg-green-500 text-white">
                    {summary.totalChildren - summary.overdueVaccinations - summary.upcomingVaccinations}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Target className="h-5 w-5 mr-2 text-green-500" />
                  Performance Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Coverage Target (95%)</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{coveragePercentage}%</span>
                      {coveragePercentage >= 95 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <ProgressBar percentage={coveragePercentage} color={coveragePercentage >= 95 ? "bg-green-500" : "bg-orange-500"} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Budget Target (75-90%)</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{summary.budgetUtilization}%</span>
                      {summary.budgetUtilization >= 75 && summary.budgetUtilization <= 90 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <ProgressBar percentage={summary.budgetUtilization} color="bg-blue-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Compliance (90%+)</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{summary.complianceScore}%</span>
                      {summary.complianceScore >= 90 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <ProgressBar percentage={summary.complianceScore} color="bg-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="immunization" className="space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Immunization Coverage by Vaccine</CardTitle>
              <CardDescription>
                Coverage percentages for each vaccine in the national schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {immunizationCoverage.map((vaccine, index) => (
                  <div key={vaccine.vaccine} className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{vaccine.vaccine}</span>
                      <span className="font-bold text-gray-800">{vaccine.coveragePercentage}%</span>
                    </div>
                    <ProgressBar
                      percentage={vaccine.coveragePercentage}
                      color={vaccine.coveragePercentage >= 95 ? "bg-green-500" : vaccine.coveragePercentage >= 90 ? "bg-yellow-500" : "bg-red-500"}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{vaccine.administeredDoses} administered</span>
                      <span>{vaccine.totalDoses} eligible</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Budget Utilization by Category</CardTitle>
              <CardDescription>
                Current spending against allocated budget per category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetBreakdown.map((category) => {
                  const utilizationPercentage = (category.spent / category.allocated) * 100;
                  return (
                    <div key={category.category} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{category.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-800">{utilizationPercentage.toFixed(1)}%</span>
                          {category.isOverLimit && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <ProgressBar
                        percentage={Math.min(utilizationPercentage, 100)}
                        color={category.isOverLimit ? "bg-red-500" : utilizationPercentage >= 90 ? "bg-orange-500" : "bg-blue-500"}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>K{category.spent.toLocaleString()} spent</span>
                        <span>K{category.allocated.toLocaleString()} allocated</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <Alert key={index} className={`border-l-4 shadow-md ${
                alert.priority === 'high' ? 'border-l-red-500 bg-red-50 border-red-200' :
                alert.priority === 'medium' ? 'border-l-orange-500 bg-orange-50 border-orange-200' :
                'border-l-green-500 bg-green-50 border-green-200'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.priority === 'high' ? 'text-red-500' :
                  alert.priority === 'medium' ? 'text-orange-500' :
                  'text-green-500'
                }`} />
                <AlertDescription className={
                  alert.priority === 'high' ? 'text-red-800' :
                  alert.priority === 'medium' ? 'text-orange-800' :
                  'text-green-800'
                }>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
