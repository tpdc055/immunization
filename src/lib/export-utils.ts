import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { PNG_PROVINCES } from './geographic-data';

// Types for export data
export interface ProvinceReportData {
  provinceName: string;
  totalChildren: number;
  fullyImmunized: number;
  partiallyImmunized: number;
  notStarted: number;
  coveragePercentage: number;
  budgetAllocated: number;
  budgetSpent: number;
  budgetUtilization: number;
  facilities: number;
  healthWorkers: number;
  lastUpdated: string;
}

export interface ExportOptions {
  includeCharts?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  provinces?: string[];
  reportType?: 'summary' | 'detailed' | 'comparison';
}

// Generate Province Report Data
export function generateProvinceReportData(provinceId?: string): ProvinceReportData[] {
  const provinces = provinceId
    ? PNG_PROVINCES.filter(p => p.id === provinceId)
    : PNG_PROVINCES;

  return provinces.map(province => ({
    provinceName: province.name,
    totalChildren: province.children.total,
    fullyImmunized: province.children.fullyImmunized,
    partiallyImmunized: province.children.partiallyImmunized,
    notStarted: province.children.notStarted,
    coveragePercentage: Math.round((province.children.fullyImmunized / province.children.total) * 100),
    budgetAllocated: province.budget.allocated,
    budgetSpent: province.budget.spent,
    budgetUtilization: province.budget.utilization,
    facilities: province.facilities,
    healthWorkers: province.healthWorkers,
    lastUpdated: province.lastUpdated.toLocaleDateString()
  }));
}

// PDF Export Functions
export class PDFExporter {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  // Add PNG Government Header
  private addHeader() {
    this.doc.setFontSize(16);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('GOVERNMENT OF PAPUA NEW GUINEA', 20, 20);

    this.doc.setFontSize(14);
    this.doc.text('Department of Health', 20, 30);

    this.doc.setFontSize(12);
    this.doc.setTextColor(52, 152, 219);
    this.doc.text('Child Immunization Monitoring System', 20, 40);

    // Add line separator
    this.doc.setDrawColor(52, 152, 219);
    this.doc.line(20, 45, 190, 45);

    return 55; // Return Y position for next content
  }

  // Add Footer
  private addFooter(pageNumber: number) {
    const pageHeight = this.doc.internal.pageSize.height;
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 20);
    this.doc.text(`Page ${pageNumber}`, 170, pageHeight - 20);
    this.doc.text('CONFIDENTIAL - For Official Use Only', 20, pageHeight - 10);
  }

  // Generate Provincial Summary Report
  async generateProvincialSummary(provinceId?: string): Promise<Blob> {
    const data = generateProvinceReportData(provinceId);
    let yPosition = this.addHeader();

    // Report Title
    this.doc.setFontSize(14);
    this.doc.setTextColor(44, 62, 80);
    const title = provinceId
      ? `Provincial Immunization Report - ${data[0]?.provinceName}`
      : 'National Immunization Coverage Report';
    this.doc.text(title, 20, yPosition);
    yPosition += 20;

    // Summary Statistics
    if (!provinceId) {
      const totalChildren = data.reduce((sum, p) => sum + p.totalChildren, 0);
      const totalImmunized = data.reduce((sum, p) => sum + p.fullyImmunized, 0);
      const overallCoverage = Math.round((totalImmunized / totalChildren) * 100);

      this.doc.setFontSize(12);
      this.doc.setTextColor(39, 174, 96);
      this.doc.text('NATIONAL SUMMARY', 20, yPosition);
      yPosition += 10;

      this.doc.setFontSize(10);
      this.doc.setTextColor(44, 62, 80);
      this.doc.text(`Total Children Registered: ${totalChildren.toLocaleString()}`, 20, yPosition);
      this.doc.text(`Overall Coverage: ${overallCoverage}%`, 120, yPosition);
      yPosition += 8;
      this.doc.text(`Fully Immunized: ${totalImmunized.toLocaleString()}`, 20, yPosition);
      this.doc.text(`Total Provinces: ${data.length}`, 120, yPosition);
      yPosition += 20;
    }

    // Province Details Table
    this.doc.setFontSize(12);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('PROVINCIAL BREAKDOWN', 20, yPosition);
    yPosition += 15;

    // Table Headers
    this.doc.setFontSize(8);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFillColor(52, 152, 219);
    this.doc.rect(20, yPosition - 5, 170, 10, 'F');

    this.doc.text('Province', 22, yPosition);
    this.doc.text('Children', 60, yPosition);
    this.doc.text('Immunized', 85, yPosition);
    this.doc.text('Coverage', 115, yPosition);
    this.doc.text('Budget', 140, yPosition);
    this.doc.text('Facilities', 165, yPosition);
    yPosition += 8;

    // Table Data
    this.doc.setTextColor(44, 62, 80);
    data.forEach((province, index) => {
      if (yPosition > 250) {
        this.addFooter(1);
        this.doc.addPage();
        yPosition = this.addHeader();
      }

      const fillColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
      this.doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      this.doc.rect(20, yPosition - 5, 170, 8, 'F');

      this.doc.text(province.provinceName.substring(0, 18), 22, yPosition);
      this.doc.text(province.totalChildren.toLocaleString(), 60, yPosition);
      this.doc.text(province.fullyImmunized.toLocaleString(), 85, yPosition);
      this.doc.text(`${province.coveragePercentage}%`, 115, yPosition);
      this.doc.text(`${province.budgetUtilization}%`, 140, yPosition);
      this.doc.text(province.facilities.toString(), 165, yPosition);
      yPosition += 8;
    });

    // Performance Analysis
    yPosition += 20;
    if (yPosition > 230) {
      this.addFooter(1);
      this.doc.addPage();
      yPosition = this.addHeader();
    }

    this.doc.setFontSize(12);
    this.doc.setTextColor(39, 174, 96);
    this.doc.text('PERFORMANCE ANALYSIS', 20, yPosition);
    yPosition += 15;

    // Top Performers
    const topPerformers = [...data].sort((a, b) => b.coveragePercentage - a.coveragePercentage).slice(0, 3);
    this.doc.setFontSize(10);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text('Top Performing Provinces:', 20, yPosition);
    yPosition += 8;

    topPerformers.forEach((province, index) => {
      this.doc.text(`${index + 1}. ${province.provinceName} - ${province.coveragePercentage}%`, 25, yPosition);
      yPosition += 6;
    });

    // Areas for Improvement
    const lowPerformers = [...data].sort((a, b) => a.coveragePercentage - b.coveragePercentage).slice(0, 3);
    yPosition += 10;
    this.doc.text('Areas Requiring Attention:', 20, yPosition);
    yPosition += 8;

    lowPerformers.forEach((province, index) => {
      this.doc.text(`${index + 1}. ${province.provinceName} - ${province.coveragePercentage}%`, 25, yPosition);
      yPosition += 6;
    });

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  // Generate Detailed Province Report
  async generateDetailedReport(provinceId: string): Promise<Blob> {
    const province = PNG_PROVINCES.find(p => p.id === provinceId);
    if (!province) throw new Error('Province not found');

    let yPosition = this.addHeader();

    // Province Header
    this.doc.setFontSize(16);
    this.doc.setTextColor(44, 62, 80);
    this.doc.text(`${province.name} - Detailed Report`, 20, yPosition);
    yPosition += 20;

    // Key Metrics Section
    this.doc.setFontSize(12);
    this.doc.setTextColor(39, 174, 96);
    this.doc.text('KEY PERFORMANCE INDICATORS', 20, yPosition);
    yPosition += 15;

    // Coverage Metrics
    const coverage = Math.round((province.children.fullyImmunized / province.children.total) * 100);
    this.doc.setFontSize(10);
    this.doc.setTextColor(44, 62, 80);

    const metrics = [
      ['Total Children Registered:', province.children.total.toLocaleString()],
      ['Fully Immunized:', province.children.fullyImmunized.toLocaleString()],
      ['Partially Immunized:', province.children.partiallyImmunized.toLocaleString()],
      ['Not Started:', province.children.notStarted.toLocaleString()],
      ['Coverage Rate:', `${coverage}%`],
      ['Health Facilities:', province.facilities.toString()],
      ['Health Workers:', province.healthWorkers.toString()],
      ['Budget Allocated:', `$${province.budget.allocated.toLocaleString()}`],
      ['Budget Spent:', `$${province.budget.spent.toLocaleString()}`],
      ['Budget Utilization:', `${province.budget.utilization}%`]
    ];

    metrics.forEach(([label, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col === 0 ? 20 : 110;
      const y = yPosition + (row * 8);

      this.doc.text(label, x, y);
      this.doc.text(value, x + 60, y);
    });

    yPosition += Math.ceil(metrics.length / 2) * 8 + 20;

    // Vaccine-specific breakdown
    this.doc.setFontSize(12);
    this.doc.setTextColor(39, 174, 96);
    this.doc.text('VACCINE COVERAGE BREAKDOWN', 20, yPosition);
    yPosition += 15;

    const vaccines = [
      ['BCG (Birth)', `${province.coverage.bcg}%`],
      ['DPT 1st Dose', `${province.coverage.dpt1}%`],
      ['DPT 2nd Dose', `${province.coverage.dpt2}%`],
      ['DPT 3rd Dose', `${province.coverage.dpt3}%`],
      ['Measles', `${province.coverage.measles}%`]
    ];

    this.doc.setFontSize(10);
    this.doc.setTextColor(44, 62, 80);
    vaccines.forEach(([vaccine, coverage]) => {
      this.doc.text(vaccine, 20, yPosition);
      this.doc.text(coverage, 80, yPosition);
      yPosition += 8;
    });

    // Recommendations
    yPosition += 20;
    this.doc.setFontSize(12);
    this.doc.setTextColor(39, 174, 96);
    this.doc.text('RECOMMENDATIONS', 20, yPosition);
    yPosition += 15;

    const recommendations = [
      'Continue monitoring coverage rates monthly',
      'Focus on completing partial immunizations',
      'Strengthen cold chain management',
      'Increase community outreach activities',
      'Ensure adequate vaccine stock levels'
    ];

    this.doc.setFontSize(10);
    this.doc.setTextColor(44, 62, 80);
    recommendations.forEach((rec, index) => {
      this.doc.text(`${index + 1}. ${rec}`, 20, yPosition);
      yPosition += 8;
    });

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }
}

// Excel Export Functions
export class ExcelExporter {
  // Generate Provincial Summary Excel
  generateProvincialSummary(provinceId?: string): Blob {
    const data = generateProvinceReportData(provinceId);

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = data.map(province => ({
      'Province': province.provinceName,
      'Total Children': province.totalChildren,
      'Fully Immunized': province.fullyImmunized,
      'Partially Immunized': province.partiallyImmunized,
      'Not Started': province.notStarted,
      'Coverage %': province.coveragePercentage,
      'Budget Allocated': province.budgetAllocated,
      'Budget Spent': province.budgetSpent,
      'Budget Utilization %': province.budgetUtilization,
      'Health Facilities': province.facilities,
      'Health Workers': province.healthWorkers,
      'Last Updated': province.lastUpdated
    }));

    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Provincial Summary');

    // Statistics Sheet
    const totalChildren = data.reduce((sum, p) => sum + p.totalChildren, 0);
    const totalImmunized = data.reduce((sum, p) => sum + p.fullyImmunized, 0);
    const overallCoverage = Math.round((totalImmunized / totalChildren) * 100);

    const statsData = [
      ['Metric', 'Value'],
      ['Total Provinces', data.length],
      ['Total Children', totalChildren],
      ['Total Fully Immunized', totalImmunized],
      ['Overall Coverage %', overallCoverage],
      ['Generated Date', new Date().toLocaleDateString()]
    ];

    const ws2 = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'National Statistics');

    // Performance Rankings
    const rankings = [...data]
      .sort((a, b) => b.coveragePercentage - a.coveragePercentage)
      .map((province, index) => ({
        'Rank': index + 1,
        'Province': province.provinceName,
        'Coverage %': province.coveragePercentage,
        'Performance Level':
          province.coveragePercentage >= 95 ? 'Excellent' :
          province.coveragePercentage >= 85 ? 'Good' :
          province.coveragePercentage >= 75 ? 'Fair' :
          province.coveragePercentage >= 65 ? 'Poor' : 'Critical'
      }));

    const ws3 = XLSX.utils.json_to_sheet(rankings);
    XLSX.utils.book_append_sheet(wb, ws3, 'Performance Rankings');

    // Generate file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Generate Detailed Province Excel
  generateDetailedReport(provinceId: string): Blob {
    const province = PNG_PROVINCES.find(p => p.id === provinceId);
    if (!province) throw new Error('Province not found');

    const wb = XLSX.utils.book_new();

    // Overview Sheet
    const overviewData = [
      ['Province Information', ''],
      ['Province Name', province.name],
      ['Province Code', province.code],
      ['Capital', province.capital],
      ['Population', province.population],
      ['', ''],
      ['Immunization Statistics', ''],
      ['Total Children', province.children.total],
      ['Fully Immunized', province.children.fullyImmunized],
      ['Partially Immunized', province.children.partiallyImmunized],
      ['Not Started', province.children.notStarted],
      ['Overdue', province.children.overdue],
      ['Upcoming', province.children.upcoming],
      ['Coverage Rate %', Math.round((province.children.fullyImmunized / province.children.total) * 100)],
      ['', ''],
      ['Resources', ''],
      ['Health Facilities', province.facilities],
      ['Health Workers', province.healthWorkers],
      ['', ''],
      ['Budget Information', ''],
      ['Budget Allocated', province.budget.allocated],
      ['Budget Spent', province.budget.spent],
      ['Budget Utilization %', province.budget.utilization],
      ['', ''],
      ['Report Information', ''],
      ['Generated Date', new Date().toLocaleDateString()],
      ['Last Updated', province.lastUpdated.toLocaleDateString()]
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview');

    // Vaccine Coverage Sheet
    const vaccineData = [
      ['Vaccine', 'Coverage %', 'Status'],
      ['BCG (Birth)', province.coverage.bcg, province.coverage.bcg >= 95 ? 'Excellent' : province.coverage.bcg >= 85 ? 'Good' : 'Needs Improvement'],
      ['DPT 1st Dose', province.coverage.dpt1, province.coverage.dpt1 >= 95 ? 'Excellent' : province.coverage.dpt1 >= 85 ? 'Good' : 'Needs Improvement'],
      ['DPT 2nd Dose', province.coverage.dpt2, province.coverage.dpt2 >= 95 ? 'Excellent' : province.coverage.dpt2 >= 85 ? 'Good' : 'Needs Improvement'],
      ['DPT 3rd Dose', province.coverage.dpt3, province.coverage.dpt3 >= 95 ? 'Excellent' : province.coverage.dpt3 >= 85 ? 'Good' : 'Needs Improvement'],
      ['Measles', province.coverage.measles, province.coverage.measles >= 95 ? 'Excellent' : province.coverage.measles >= 85 ? 'Good' : 'Needs Improvement']
    ];

    const ws2 = XLSX.utils.aoa_to_sheet(vaccineData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Vaccine Coverage');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

// Utility Functions
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateFileName(type: 'pdf' | 'excel', reportType: string, provinceName?: string): string {
  const date = new Date().toISOString().split('T')[0];
  const extension = type === 'pdf' ? 'pdf' : 'xlsx';
  const province = provinceName ? `_${provinceName.replace(/\s+/g, '_')}` : '_National';
  return `PNG_Immunization_${reportType}${province}_${date}.${extension}`;
}
