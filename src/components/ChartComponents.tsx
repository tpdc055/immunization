'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { PNG_PROVINCES } from '@/lib/geographic-data';

// Color schemes for charts
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: '#6b7280'
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface ChartProps {
  data?: any[];
  title: string;
  description?: string;
  height?: number;
}

// Provincial Coverage Comparison Bar Chart
export function ProvincialCoverageChart({ title, description, height = 300 }: ChartProps) {
  const data = PNG_PROVINCES.map(province => ({
    name: province.name.length > 15 ? province.code : province.name,
    fullName: province.name,
    coverage: Math.round((province.children.fullyImmunized / province.children.total) * 100),
    children: province.children.total,
    facilities: province.facilities
  })).sort((a, b) => b.coverage - a.coverage);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-sm text-blue-600">
            Coverage: <span className="font-bold">{data.coverage}%</span>
          </p>
          <p className="text-xs text-gray-600">
            Children: {data.children.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">
            Facilities: {data.facilities}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={10}
            />
            <YAxis
              label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="coverage"
              fill={COLORS.primary}
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.coverage >= 95 ? COLORS.success :
                    entry.coverage >= 85 ? COLORS.info :
                    entry.coverage >= 75 ? COLORS.warning :
                    COLORS.danger
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Coverage Trend Line Chart
export function CoverageTrendChart({ title, description, height = 300 }: ChartProps) {
  // Generate sample trend data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const data = months.map((month, index) => ({
    month,
    national: 84 + Math.random() * 6,
    highlands: 87 + Math.random() * 5,
    islands: 82 + Math.random() * 8,
    momase: 79 + Math.random() * 7,
    southern: 86 + Math.random() * 4
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" />
            <YAxis
              label={{ value: 'Coverage (%)', angle: -90, position: 'insideLeft' }}
              domain={[70, 100]}
            />
            <Tooltip
              formatter={(value: any, name: string) => [
                `${value.toFixed(1)}%`,
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="national"
              stroke={COLORS.primary}
              strokeWidth={3}
              name="National"
              dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="highlands"
              stroke={COLORS.success}
              strokeWidth={2}
              name="Highlands"
              dot={{ fill: COLORS.success, strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="islands"
              stroke={COLORS.info}
              strokeWidth={2}
              name="Islands"
              dot={{ fill: COLORS.info, strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="momase"
              stroke={COLORS.warning}
              strokeWidth={2}
              name="Momase"
              dot={{ fill: COLORS.warning, strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="southern"
              stroke={COLORS.secondary}
              strokeWidth={2}
              name="Southern"
              dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Budget Allocation Pie Chart
export function BudgetAllocationChart({ title, description, height = 300 }: ChartProps) {
  const data = [
    { name: 'Personnel', value: 30, amount: 450000 },
    { name: 'Vaccines', value: 25, amount: 375000 },
    { name: 'Community Outreach', value: 20, amount: 300000 },
    { name: 'Cold Chain', value: 15, amount: 225000 },
    { name: 'Administration', value: 6, amount: 90000 },
    { name: 'M&E', value: 4, amount: 60000 }
  ];

  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-blue-600">
            Percentage: <span className="font-bold">{data.value}%</span>
          </p>
          <p className="text-sm text-green-600">
            Amount: <span className="font-bold">${data.amount.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
              />
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Vaccine Performance Radial Chart
export function VaccinePerformanceChart({ title, description, height = 300 }: ChartProps) {
  const data = [
    { name: 'BCG', coverage: 99.2, fill: COLORS.success },
    { name: 'DPT1', coverage: 98.4, fill: COLORS.info },
    { name: 'DPT2', coverage: 97.4, fill: COLORS.primary },
    { name: 'DPT3', coverage: 93.9, fill: COLORS.warning },
    { name: 'Measles', coverage: 95.6, fill: COLORS.secondary }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            data={data}
          >
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
              background
              dataKey="coverage"
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Tooltip
              formatter={(value: any) => [`${value}%`, 'Coverage']}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Regional Performance Area Chart
export function RegionalPerformanceChart({ title, description, height = 300 }: ChartProps) {
  const data = [
    { region: 'Highlands', coverage: 87, budget: 82, activities: 24 },
    { region: 'Southern', coverage: 85, budget: 78, activities: 18 },
    { region: 'Islands', coverage: 82, budget: 85, activities: 15 },
    { region: 'Momase', coverage: 79, budget: 73, activities: 21 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="region" />
            <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: any, name: string) => [
                `${value}%`,
                name === 'coverage' ? 'Coverage' :
                name === 'budget' ? 'Budget Utilization' : 'Activities'
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="coverage"
              stackId="1"
              stroke={COLORS.success}
              fill={COLORS.success}
              fillOpacity={0.6}
              name="Coverage"
            />
            <Area
              type="monotone"
              dataKey="budget"
              stackId="2"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.6}
              name="Budget"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Performance Metrics Dashboard
export function PerformanceMetricsChart({ title, description, height = 400 }: ChartProps) {
  const performanceData = PNG_PROVINCES.slice(0, 10).map(province => ({
    name: province.code,
    fullName: province.name,
    coverage: Math.round((province.children.fullyImmunized / province.children.total) * 100),
    budget: province.budget.utilization,
    efficiency: Math.round((province.children.fullyImmunized / province.facilities) * 10) / 10
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-blue-600">Coverage %</Badge>
          <Badge variant="outline" className="text-green-600">Budget Utilization %</Badge>
          <Badge variant="outline" className="text-purple-600">Efficiency Index</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              fontSize={10}
            />
            <YAxis label={{ value: 'Percentage / Index', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: any, name: string) => [
                `${value}${name === 'efficiency' ? '' : '%'}`,
                name === 'coverage' ? 'Coverage' :
                name === 'budget' ? 'Budget Utilization' : 'Efficiency Index'
              ]}
              labelFormatter={(label) => performanceData.find(d => d.name === label)?.fullName || label}
            />
            <Legend />
            <Bar dataKey="coverage" fill={COLORS.primary} name="Coverage" />
            <Bar dataKey="budget" fill={COLORS.success} name="Budget" />
            <Bar dataKey="efficiency" fill={COLORS.secondary} name="Efficiency" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
