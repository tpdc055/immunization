'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Building2,
  Bell,
  BellOff,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine } from 'recharts';
import { PNG_PROVINCES } from '@/lib/geographic-data';

interface RealTimeAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  provinceId?: string;
  timestamp: Date;
  isRead: boolean;
}

interface LiveMetric {
  timestamp: Date;
  coverage: number;
  newRegistrations: number;
  vaccinesAdministered: number;
  budgetUtilization: number;
  alertsCount: number;
}

const ALERT_TYPES = {
  critical: { color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', icon: AlertTriangle },
  warning: { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: AlertTriangle },
  info: { color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', icon: Clock },
  success: { color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', icon: CheckCircle }
};

export default function RealTimeDashboard() {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [liveData, setLiveData] = useState<LiveMetric[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<RealTimeAlert[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    coverage: 84.2,
    newRegistrations: 45,
    vaccinesAdministered: 234,
    budgetUtilization: 78.5,
    alertsCount: 3
  });

  // Generate initial data
  useEffect(() => {
    const now = new Date();
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: new Date(now.getTime() - (19 - i) * 60000), // Last 20 minutes
      coverage: 84 + Math.random() * 2,
      newRegistrations: Math.floor(Math.random() * 10) + 40,
      vaccinesAdministered: Math.floor(Math.random() * 50) + 200,
      budgetUtilization: 78 + Math.random() * 3,
      alertsCount: Math.floor(Math.random() * 5) + 1
    }));
    setLiveData(initialData);

    // Generate initial alerts
    const initialAlerts: RealTimeAlert[] = [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'Low Coverage Alert',
        message: 'Western Province coverage dropped below 75%',
        provinceId: 'western',
        timestamp: new Date(now.getTime() - 300000),
        isRead: false
      },
      {
        id: 'alert-2',
        type: 'success',
        title: 'Target Achieved',
        message: 'National Capital District exceeded 95% coverage',
        provinceId: 'ncd',
        timestamp: new Date(now.getTime() - 600000),
        isRead: false
      },
      {
        id: 'alert-3',
        type: 'critical',
        title: 'Stock Shortage',
        message: 'BCG vaccine stock critically low in Morobe Province',
        provinceId: 'morobe',
        timestamp: new Date(now.getTime() - 900000),
        isRead: false
      }
    ];
    setRecentAlerts(initialAlerts);
  }, []);

  // Live data updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const now = new Date();
      const newMetric: LiveMetric = {
        timestamp: now,
        coverage: currentMetrics.coverage + (Math.random() - 0.5) * 0.5,
        newRegistrations: Math.floor(Math.random() * 15) + 35,
        vaccinesAdministered: Math.floor(Math.random() * 60) + 180,
        budgetUtilization: currentMetrics.budgetUtilization + (Math.random() - 0.5) * 0.3,
        alertsCount: Math.floor(Math.random() * 6) + 1
      };

      setLiveData(prev => [...prev.slice(-19), newMetric]);
      setCurrentMetrics({
        coverage: newMetric.coverage,
        newRegistrations: newMetric.newRegistrations,
        vaccinesAdministered: newMetric.vaccinesAdministered,
        budgetUtilization: newMetric.budgetUtilization,
        alertsCount: newMetric.alertsCount
      });

      // Randomly generate new alerts
      if (Math.random() < 0.1) { // 10% chance every update
        const alertTypes: ('critical' | 'warning' | 'info' | 'success')[] = ['critical', 'warning', 'info', 'success'];
        const provinces = PNG_PROVINCES.slice(0, 10); // Use first 10 provinces

        const newAlert: RealTimeAlert = {
          id: `alert-${Date.now()}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          title: 'Real-time Alert',
          message: 'System-generated alert for demonstration',
          provinceId: provinces[Math.floor(Math.random() * provinces.length)].id,
          timestamp: now,
          isRead: false
        };

        setRecentAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLiveMode, currentMetrics]);

  const markAlertAsRead = (alertId: string) => {
    setRecentAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const unreadAlertsCount = recentAlerts.filter(alert => !alert.isRead).length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const LiveMetricCard = ({
    title,
    value,
    unit,
    trend,
    icon: Icon,
    color = 'blue'
  }: {
    title: string;
    value: number;
    unit: string;
    trend?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }) => (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </div>
        {trend !== undefined && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            ) : null}
            <span className={trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : ''}>
              {trend > 0 ? '+' : ''}{trend?.toFixed(2)}{unit} from last update
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Real-Time Immunization Dashboard
          </h2>
          <p className="text-gray-600">Live monitoring and alerts for Papua New Guinea</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isLiveMode ? 'Live' : 'Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
          >
            {isLiveMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Live Alerts Banner */}
      {notifications && unreadAlertsCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{unreadAlertsCount} new alert{unreadAlertsCount > 1 ? 's' : ''}</strong> requiring attention.
            Check the alerts panel for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <LiveMetricCard
          title="Coverage Rate"
          value={currentMetrics.coverage}
          unit="%"
          icon={Target}
          color="green"
        />
        <LiveMetricCard
          title="New Registrations"
          value={currentMetrics.newRegistrations}
          unit=""
          icon={Users}
          color="blue"
        />
        <LiveMetricCard
          title="Vaccines Given"
          value={currentMetrics.vaccinesAdministered}
          unit=""
          icon={Activity}
          color="purple"
        />
        <LiveMetricCard
          title="Budget Utilization"
          value={currentMetrics.budgetUtilization}
          unit="%"
          icon={DollarSign}
          color="orange"
        />
        <LiveMetricCard
          title="Active Alerts"
          value={currentMetrics.alertsCount}
          unit=""
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts and Alerts */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Live Trends</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {unreadAlertsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coverage Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Coverage Trend (Live)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={liveData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => formatTime(new Date(value))}
                      fontSize={10}
                    />
                    <YAxis
                      domain={[82, 88]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Coverage']}
                    />
                    <Line
                      type="monotone"
                      dataKey="coverage"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                      connectNulls
                    />
                    <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={liveData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(value) => formatTime(new Date(value))}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: any, name: string) => [
                        value,
                        name === 'newRegistrations' ? 'New Registrations' : 'Vaccines Given'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="newRegistrations"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="vaccinesAdministered"
                      stackId="2"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-600" />
                  Real-Time Alerts
                </span>
                <Badge variant="outline">
                  {unreadAlertsCount} unread
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No recent alerts</p>
                  </div>
                ) : (
                  recentAlerts.map((alert) => {
                    const alertConfig = ALERT_TYPES[alert.type];
                    const Icon = alertConfig.icon;

                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          alert.isRead
                            ? 'bg-gray-50 border-gray-200 opacity-75'
                            : `${alertConfig.bgColor} border-${alert.type === 'critical' ? 'red' : alert.type === 'warning' ? 'yellow' : alert.type === 'info' ? 'blue' : 'green'}-200`
                        }`}
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1 rounded-full ${alertConfig.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold ${alertConfig.textColor}`}>
                                {alert.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {alert.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                            {alert.provinceId && (
                              <Badge variant="outline" className="mt-2">
                                {PNG_PROVINCES.find(p => p.id === alert.provinceId)?.name || alert.provinceId}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Data Refresh Rate</span>
                    <Badge className="bg-green-100 text-green-800">3.0s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Connected Facilities</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {PNG_PROVINCES.reduce((sum, p) => sum + p.facilities, 0)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Data Sync</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {new Date().toLocaleTimeString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Status</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { type: 'Critical', count: recentAlerts.filter(a => a.type === 'critical').length },
                    { type: 'Warning', count: recentAlerts.filter(a => a.type === 'warning').length },
                    { type: 'Info', count: recentAlerts.filter(a => a.type === 'info').length },
                    { type: 'Success', count: recentAlerts.filter(a => a.type === 'success').length },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
