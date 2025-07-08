import { VaccineSchedule, BudgetCategory, BudgetConstraint } from './types';

// National Immunization Schedule (Papua New Guinea standard schedule)
export const VACCINE_SCHEDULE: VaccineSchedule[] = [
  {
    id: 'bcg-birth',
    vaccineName: 'BCG',
    doseNumber: 1,
    ageInWeeks: 0,
    description: 'Bacillus Calmette-Guérin vaccine against tuberculosis',
    isActive: true,
  },
  {
    id: 'hepb-birth',
    vaccineName: 'Hepatitis B',
    doseNumber: 1,
    ageInWeeks: 0,
    description: 'Hepatitis B vaccine - birth dose',
    isActive: true,
  },
  {
    id: 'dpt-hepb-hib-1',
    vaccineName: 'DPT-HepB-Hib',
    doseNumber: 1,
    ageInWeeks: 6,
    description: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b - first dose',
    isActive: true,
  },
  {
    id: 'opv-1',
    vaccineName: 'OPV',
    doseNumber: 1,
    ageInWeeks: 6,
    description: 'Oral Polio Vaccine - first dose',
    isActive: true,
  },
  {
    id: 'dpt-hepb-hib-2',
    vaccineName: 'DPT-HepB-Hib',
    doseNumber: 2,
    ageInWeeks: 10,
    description: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b - second dose',
    isActive: true,
  },
  {
    id: 'opv-2',
    vaccineName: 'OPV',
    doseNumber: 2,
    ageInWeeks: 10,
    description: 'Oral Polio Vaccine - second dose',
    isActive: true,
  },
  {
    id: 'dpt-hepb-hib-3',
    vaccineName: 'DPT-HepB-Hib',
    doseNumber: 3,
    ageInWeeks: 14,
    description: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b - third dose',
    isActive: true,
  },
  {
    id: 'opv-3',
    vaccineName: 'OPV',
    doseNumber: 3,
    ageInWeeks: 14,
    description: 'Oral Polio Vaccine - third dose',
    isActive: true,
  },
  {
    id: 'measles-1',
    vaccineName: 'Measles',
    doseNumber: 1,
    ageInWeeks: 36,
    description: 'Measles vaccine - first dose (9 months)',
    isActive: true,
  },
  {
    id: 'measles-2',
    vaccineName: 'Measles',
    doseNumber: 2,
    ageInWeeks: 78,
    description: 'Measles vaccine - second dose (18 months)',
    isActive: true,
  },
];

// Budget Categories
export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'personnel',
    name: 'Personnel',
    description: 'Salaries, allowances, and benefits for health workers',
    maxPercentage: 30,
    isHardConstraint: true,
  },
  {
    id: 'vaccines',
    name: 'Vaccines',
    description: 'Procurement and distribution of vaccines',
    isHardConstraint: false,
  },
  {
    id: 'cold-chain',
    name: 'Cold Chain & Logistics',
    description: 'Refrigeration, storage, and transport equipment',
    minPercentage: 15,
    isHardConstraint: false,
  },
  {
    id: 'monitoring-evaluation',
    name: 'M&E',
    description: 'Monitoring and Evaluation activities',
    minPercentage: 5,
    isHardConstraint: true,
  },
  {
    id: 'advocacy-training',
    name: 'Advocacy & Training',
    description: 'Community advocacy, health education, and staff training',
    minPercentage: 10,
    isHardConstraint: false,
  },
  {
    id: 'community-outreach',
    name: 'Community Outreach',
    description: 'Outreach activities and community engagement',
    minPercentage: 20,
    isHardConstraint: false,
  },
  {
    id: 'administration',
    name: 'Administration',
    description: 'Administrative costs and governance',
    maxPercentage: 10,
    isHardConstraint: true,
  },
];

// Budget Constraints
export const BUDGET_CONSTRAINTS: BudgetConstraint[] = [
  {
    categoryId: 'administration',
    type: 'max',
    percentage: 10,
    isHard: true,
  },
  {
    categoryId: 'monitoring-evaluation',
    type: 'min',
    percentage: 5,
    isHard: true,
  },
  {
    categoryId: 'personnel',
    type: 'max',
    percentage: 30,
    isHard: true,
  },
  {
    categoryId: 'cold-chain',
    type: 'min',
    percentage: 15,
    isHard: false,
  },
  {
    categoryId: 'advocacy-training',
    type: 'min',
    percentage: 10,
    isHard: false,
  },
  {
    categoryId: 'community-outreach',
    type: 'min',
    percentage: 20,
    isHard: false,
  },
];

// System Constants
export const SYSTEM_CONSTANTS = {
  OVERDUE_THRESHOLD_DAYS: 14, // Days after scheduled date to consider vaccine overdue
  ALERT_REMINDER_DAYS: 7, // Days before due date to send reminder
  MAX_FILE_SIZE_MB: 10, // Maximum file size for document uploads
  SESSION_TIMEOUT_MINUTES: 60, // Session timeout
  PAGINATION_PAGE_SIZE: 20, // Default page size for tables
  EXPORT_MAX_RECORDS: 10000, // Maximum records for export
};

// User Roles and Permissions
export const USER_ROLES = {
  ADMINISTRATOR: {
    id: 'administrator',
    name: 'Administrator',
    permissions: ['all'],
  },
  HEALTH_WORKER: {
    id: 'health_worker',
    name: 'Health Worker',
    permissions: ['child_registry', 'vaccine_recording', 'activity_tracking'],
  },
  FINANCE_OFFICER: {
    id: 'finance_officer',
    name: 'Finance Officer',
    permissions: ['budget_management', 'expense_tracking', 'financial_reports'],
  },
  PROGRAM_MANAGER: {
    id: 'program_manager',
    name: 'Program Manager',
    permissions: ['dashboard_view', 'reports', 'governance', 'monitoring'],
  },
  DONOR: {
    id: 'donor',
    name: 'Donor',
    permissions: ['dashboard_view', 'financial_reports', 'governance_reports'],
  },
} as const;

// Chart Colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: '#6b7280',
};

// Status Colors
export const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  missed: 'bg-red-100 text-red-800',
  overdue: 'bg-orange-100 text-orange-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
};

// Performance Targets
export const PERFORMANCE_TARGETS = {
  FULL_IMMUNIZATION_COVERAGE: 95, // Percentage
  DROPOUT_RATE_MAX: 5, // Maximum acceptable dropout rate
  BUDGET_UTILIZATION_TARGET: 85, // Target budget utilization percentage
  COMPLIANCE_SCORE_MIN: 90, // Minimum compliance score
};

// Geographic Levels
export const GEOGRAPHIC_LEVELS = [
  'National',
  'Provincial',
  'District',
  'LLG',
  'Ward',
  'Facility',
] as const;

// Report Types
export const REPORT_TYPES = {
  IMMUNIZATION_COVERAGE: 'immunization_coverage',
  BUDGET_COMPLIANCE: 'budget_compliance',
  ACTIVITY_SUMMARY: 'activity_summary',
  GOVERNANCE_REPORT: 'governance_report',
  MONTHLY_SUMMARY: 'monthly_summary',
  QUARTERLY_REVIEW: 'quarterly_review',
} as const;

// Provincial Statistics Types
export const STATISTICS_TYPES = {
  IMMUNIZATION_COVERAGE: 'immunization_coverage',
  DROPOUT_RATES: 'dropout_rates',
  BUDGET_UTILIZATION: 'budget_utilization',
  CHILDREN_REGISTERED: 'children_registered',
  FACILITIES_ACTIVE: 'facilities_active',
  VACCINE_STOCK: 'vaccine_stock',
  ACTIVITY_COUNT: 'activity_count',
  COVERAGE_BY_VACCINE: 'coverage_by_vaccine',
} as const;

// Provincial Regions
export const PNG_REGIONS = [
  {
    id: 'highlands',
    name: 'Highlands Region',
    provinces: ['southern-highlands', 'western-highlands', 'enga', 'hela', 'jiwaka', 'simbu', 'eastern-highlands'],
  },
  {
    id: 'momase',
    name: 'Momase Region',
    provinces: ['morobe', 'madang', 'east-sepik', 'sandaun'],
  },
  {
    id: 'islands',
    name: 'Islands Region',
    provinces: ['milne-bay', 'manus', 'new-ireland', 'east-new-britain', 'west-new-britain', 'bougainville'],
  },
  {
    id: 'southern',
    name: 'Southern Region',
    provinces: ['ncd', 'central', 'western', 'gulf', 'oro'],
  },
] as const;
