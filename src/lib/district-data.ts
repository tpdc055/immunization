export interface DistrictData {
  id: string;
  name: string;
  provinceId: string;
  population: number;
  facilities: number;
  healthWorkers: number;
  children: {
    total: number;
    fullyImmunized: number;
    partiallyImmunized: number;
    notStarted: number;
    overdue: number;
    upcoming: number;
  };
  budget: {
    allocated: number;
    spent: number;
    utilization: number;
  };
  coverage: {
    bcg: number;
    dpt1: number;
    dpt2: number;
    dpt3: number;
    measles: number;
    overall: number;
  };
  lastUpdated: Date;
}

export const DISTRICT_DATA: DistrictData[] = [
  {
    id: 'ncd-moresby',
    name: 'Moresby District',
    provinceId: 'ncd',
    population: 150000,
    facilities: 8,
    healthWorkers: 45,
    children: {
      total: 400,
      fullyImmunized: 350,
      partiallyImmunized: 40,
      notStarted: 10,
      overdue: 15,
      upcoming: 25
    },
    budget: {
      allocated: 200000,
      spent: 160000,
      utilization: 80
    },
    coverage: {
      bcg: 95,
      dpt1: 94,
      dpt2: 92,
      dpt3: 89,
      measles: 93,
      overall: 87.6
    },
    lastUpdated: new Date()
  }
];

export function getDistrictsByProvince(provinceId: string): DistrictData[] {
  return DISTRICT_DATA.filter(d => d.provinceId === provinceId);
}

export function getDistrictById(districtId: string): DistrictData | undefined {
  return DISTRICT_DATA.find(d => d.id === districtId);
}

export function calculateDistrictPerformance(districtId: string) {
  return {
    coverageLevel: 'Good',
    budgetEfficiency: 'Good',
    overallRating: 'Good'
  };
}

export function getTopPerformingDistricts(limit: number = 5): DistrictData[] {
  return DISTRICT_DATA.slice(0, limit);
}

export function getLowPerformingDistricts(limit: number = 5): DistrictData[] {
  return DISTRICT_DATA.slice(0, limit);
}
