export interface ProvinceData {
  id: string;
  name: string;
  code: string;
  capital: string;
  population: number;
  districts: string[];
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

export const PNG_PROVINCES: ProvinceData[] = [
  {
    id: 'ncd',
    name: 'National Capital District',
    code: 'NCD',
    capital: 'Port Moresby',
    population: 364125,
    districts: ['Moresby North-East', 'Moresby North-West', 'Moresby South'],
    facilities: 23,
    healthWorkers: 187,
    children: {
      total: 847,
      fullyImmunized: 742,
      partiallyImmunized: 89,
      notStarted: 16,
      overdue: 23,
      upcoming: 67,
    },
    budget: {
      allocated: 450000,
      spent: 376500,
      utilization: 83.7,
    },
    coverage: {
      bcg: 99.4,
      dpt1: 98.8,
      dpt2: 97.9,
      dpt3: 95.2,
      measles: 96.8,
      overall: 87.6,
    },
    lastUpdated: new Date('2024-07-01'),
  },
  {
    id: 'western',
    name: 'Western Province',
    code: 'WPD',
    capital: 'Daru',
    population: 201351,
    districts: ['Middle Fly', 'North Fly', 'South Fly'],
    facilities: 12,
    healthWorkers: 56,
    children: {
      total: 423,
      fullyImmunized: 298,
      partiallyImmunized: 98,
      notStarted: 27,
      overdue: 45,
      upcoming: 78,
    },
    budget: {
      allocated: 180000,
      spent: 126000,
      utilization: 70.0,
    },
    coverage: {
      bcg: 97.2,
      dpt1: 94.6,
      dpt2: 91.3,
      dpt3: 87.8,
      measles: 89.4,
      overall: 70.4,
    },
    lastUpdated: new Date('2024-07-01'),
  },
  {
    id: 'southern-highlands',
    name: 'Southern Highlands',
    code: 'SHP',
    capital: 'Mendi',
    population: 515511,
    districts: ['Imbonggu', 'Ialibu-Pangia', 'Kagua-Erave', 'Koroba-Lake Kopiago', 'Nipa-Kutubu', 'Tari-Pori'],
    facilities: 34,
    healthWorkers: 123,
    children: {
      total: 612,
      fullyImmunized: 448,
      partiallyImmunized: 129,
      notStarted: 35,
      overdue: 38,
      upcoming: 94,
    },
    budget: {
      allocated: 320000,
      spent: 243200,
      utilization: 76.0,
    },
    coverage: {
      bcg: 98.8,
      dpt1: 96.4,
      dpt2: 93.1,
      dpt3: 89.7,
      measles: 92.3,
      overall: 73.2,
    },
    lastUpdated: new Date('2024-07-01'),
  },
  {
    id: 'morobe',
    name: 'Morobe Province',
    code: 'MPV',
    capital: 'Lae',
    population: 674810,
    districts: ['Bulolo', 'Finschhafen', 'Huon Gulf', 'Kabwum', 'Lae', 'Markham', 'Menyamya', 'Nawaeb', 'Tewae-Siassi'],
    facilities: 45,
    healthWorkers: 198,
    children: {
      total: 721,
      fullyImmunized: 589,
      partiallyImmunized: 109,
      notStarted: 23,
      overdue: 31,
      upcoming: 87,
    },
    budget: {
      allocated: 410000,
      spent: 328000,
      utilization: 80.0,
    },
    coverage: {
      bcg: 99.1,
      dpt1: 97.8,
      dpt2: 95.4,
      dpt3: 92.1,
      measles: 94.7,
      overall: 81.7,
    },
    lastUpdated: new Date('2024-07-01'),
  },
  {
    id: 'madang',
    name: 'Madang Province',
    code: 'MAP',
    capital: 'Madang',
    population: 493906,
    districts: ['Bogia', 'Madang', 'Middle Ramu', 'Rai Coast', 'Sumkar', 'Usino-Bundi'],
    facilities: 31,
    healthWorkers: 134,
    children: {
      total: 534,
      fullyImmunized: 398,
      partiallyImmunized: 102,
      notStarted: 34,
      overdue: 29,
      upcoming: 76,
    },
    budget: {
      allocated: 290000,
      spent: 217500,
      utilization: 75.0,
    },
    coverage: {
      bcg: 98.5,
      dpt1: 95.9,
      dpt2: 92.7,
      dpt3: 88.4,
      measles: 91.2,
      overall: 74.5,
    },
    lastUpdated: new Date('2024-07-01'),
  },
  {
    id: 'eastern-highlands',
    name: 'Eastern Highlands',
    code: 'EHP',
    capital: 'Goroka',
    population: 579825,
    districts: ['Daulo', 'Goroka', 'Henganofi', 'Kainantu', 'Lufa', 'Obura-Wonenara', 'Okapa', 'Unggai-Bena'],
    facilities: 38,
    healthWorkers: 156,
    children: {
      total: 645,
      fullyImmunized: 516,
      partiallyImmunized: 97,
      notStarted: 32,
      overdue: 26,
      upcoming: 89,
    },
    budget: {
      allocated: 350000,
      spent: 269500,
      utilization: 77.0,
    },
    coverage: {
      bcg: 98.9,
      dpt1: 96.7,
      dpt2: 94.2,
      dpt3: 90.5,
      measles: 93.1,
      overall: 80.0,
    },
    lastUpdated: new Date('2024-07-01'),
  },
];

export const calculateNationalTotals = (provinces: ProvinceData[]) => {
  const totals = provinces.reduce((acc, province) => ({
    children: {
      total: acc.children.total + province.children.total,
      fullyImmunized: acc.children.fullyImmunized + province.children.fullyImmunized,
      partiallyImmunized: acc.children.partiallyImmunized + province.children.partiallyImmunized,
      notStarted: acc.children.notStarted + province.children.notStarted,
      overdue: acc.children.overdue + province.children.overdue,
      upcoming: acc.children.upcoming + province.children.upcoming,
    },
    budget: {
      allocated: acc.budget.allocated + province.budget.allocated,
      spent: acc.budget.spent + province.budget.spent,
      utilization: 0,
    },
    facilities: acc.facilities + province.facilities,
    healthWorkers: acc.healthWorkers + province.healthWorkers,
    population: acc.population + province.population,
  }), {
    children: { total: 0, fullyImmunized: 0, partiallyImmunized: 0, notStarted: 0, overdue: 0, upcoming: 0 },
    budget: { allocated: 0, spent: 0, utilization: 0 },
    facilities: 0,
    healthWorkers: 0,
    population: 0,
  });

  totals.budget.utilization = (totals.budget.spent / totals.budget.allocated) * 100;

  return totals;
};

export const getProvinceByCode = (code: string) =>
  PNG_PROVINCES.find(p => p.code === code);

export const getProvinceById = (id: string) =>
  PNG_PROVINCES.find(p => p.id === id);
