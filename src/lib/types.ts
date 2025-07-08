export interface Child {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  address: string;
  ward: string;
  facility: string;
  registrationDate: Date;
  status: 'active' | 'inactive' | 'moved';
}

export interface VaccineSchedule {
  id: string;
  vaccineName: string;
  doseNumber: number;
  ageInWeeks: number;
  description: string;
  isActive: boolean;
}

export interface VaccineRecord {
  id: string;
  childId: string;
  vaccineScheduleId: string;
  scheduledDate: Date;
  administeredDate?: Date;
  batchNumber?: string;
  facilityName?: string;
  officerName?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'overdue';
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  description: string;
  maxPercentage?: number;
  minPercentage?: number;
  isHardConstraint: boolean;
}

export interface Budget {
  id: string;
  year: number;
  totalAmount: number;
  categoryAllocations: BudgetAllocation[];
  status: 'draft' | 'approved' | 'active' | 'closed';
  createdDate: Date;
  approvedDate?: Date;
}

export interface BudgetAllocation {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageOfTotal: number;
}

export interface Expense {
  id: string;
  amount: number;
  date: Date;
  categoryId: string;
  budgetId: string;
  description: string;
  paymentMethod: string;
  supportingDocuments: string[];
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  isCompliant: boolean;
  notes?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: 'outreach' | 'campaign' | 'training' | 'meeting' | 'other';
  date: Date;
  location: string;
  plannedParticipants: number;
  actualParticipants: number;
  cost: number;
  categoryId: string;
  budgetId: string;
  attendingChildren: string[];
  officerInCharge: string;
  notes?: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface GovernanceMeeting {
  id: string;
  title: string;
  date: Date;
  participants: string[];
  agenda: string[];
  decisions: string[];
  actionItems: GovernanceActionItem[];
  meetingMinutes?: string;
  nextMeetingDate?: Date;
}

export interface GovernanceActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'health_worker' | 'finance_officer' | 'program_manager' | 'donor';
  facility?: string;
  ward?: string;
  district?: string;
  province?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdDate: Date;
}

export interface PerformanceIndicator {
  id: string;
  name: string;
  description: string;
  value: number;
  target: number;
  unit: string;
  period: string;
  lastUpdated: Date;
  trend: 'improving' | 'declining' | 'stable';
}

export interface Province {
  id: string;
  name: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  districts: string[];
}

export interface ProvinceStatistics {
  provinceId: string;
  totalChildren: number;
  totalFacilities: number;
  immunizationCoverage: {
    fullyCovered: number;
    partiallyCovered: number;
    notCovered: number;
    coveragePercentage: number;
  };
  budgetUtilization: {
    allocated: number;
    spent: number;
    remaining: number;
    utilizationPercentage: number;
  };
  vaccinePerformance: VaccinePerformance[];
  activitiesThisMonth: number;
  lastUpdated: Date;
}

export interface VaccinePerformance {
  vaccineId: string;
  vaccineName: string;
  totalDoses: number;
  administeredDoses: number;
  missedDoses: number;
  coverageRate: number;
  dropoutRate: number;
}

export interface NationalStatistics {
  totalChildren: number;
  totalFacilities: number;
  totalProvinces: number;
  overallCoverage: number;
  budgetUtilization: number;
  topPerformingProvinces: ProvinceRanking[];
  lowPerformingProvinces: ProvinceRanking[];
  recentActivities: number;
  alertsCount: number;
  lastUpdated: Date;
}

export interface ProvinceRanking {
  provinceId: string;
  provinceName: string;
  coverageRate: number;
  rank: number;
}

export interface GeographicFilter {
  level: 'national' | 'regional' | 'provincial' | 'district';
  selectedIds: string[];
}

export interface StatisticsPeriod {
  startDate: Date;
  endDate: Date;
  periodType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface Alert {
  id: string;
  type: 'low_coverage' | 'budget_overrun' | 'missed_target' | 'stock_shortage' | 'missed_vaccine' | 'budget_threshold' | 'governance_task' | 'compliance_issue' | 'overdue_vaccine';
  level: 'info' | 'warning' | 'critical';
  severity?: 'critical' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  provinceId?: string;
  facilityId?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdDate: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: 'immunization_coverage' | 'budget_compliance' | 'activity_summary' | 'governance_report';
  period: {
    start: Date;
    end: Date;
  };
  generatedBy: string;
  generatedDate: Date;
  data: Record<string, unknown>;
  filePath?: string;
  isPublic: boolean;
}

// Constraint types for budget management
export interface BudgetConstraint {
  categoryId: string;
  type: 'max' | 'min';
  percentage: number;
  isHard: boolean; // Hard constraints block transactions, soft constraints only warn
}

// Dashboard summary types
export interface DashboardSummary {
  totalChildren: number;
  fullyImmunized: number;
  partiallyImmunized: number;
  notStarted: number;
  overdueVaccinations: number;
  upcomingVaccinations: number;
  budgetUtilization: number;
  activeAlerts: number;
  complianceScore: number;
}

export interface ImmunizationCoverage {
  vaccine: string;
  totalDoses: number;
  administeredDoses: number;
  coveragePercentage: number;
  dropoutRate?: number;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercentage: number;
  categoryBreakdown: {
    categoryName: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentage: number;
    isOverLimit: boolean;
  }[];
}
