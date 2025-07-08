export interface DistrictData {
  id: string;
  name: string;
  provinceId: string;
  children: { total: number; fullyImmunized: number; };
  budget: { allocated: number; spent: number; };
  coverage: { overall: number; };
}

export const DISTRICT_DATA: DistrictData[] = [];

export function getDistrictsByProvince(provinceId: string): DistrictData[] {
  return [];
}

export function getDistrictById(districtId: string): DistrictData | undefined {
  return undefined;
}

export function calculateDistrictPerformance(districtId: string) {
  return { coverageLevel: 'Good', budgetEfficiency: 'Good', overallRating: 'Good' };
}

export function getTopPerformingDistricts(limit: number = 5): DistrictData[] {
  return [];
}

export function getLowPerformingDistricts(limit: number = 5): DistrictData[] {
  return [];
}
