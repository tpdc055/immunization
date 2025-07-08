'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';
import { Expense } from '@/lib/types';
import { BUDGET_CATEGORIES, BUDGET_CONSTRAINTS } from '@/lib/constants';

// Mock data for demonstration
const mockExpenses: Expense[] = [
  {
    id: 'EXP001',
    amount: 25000,
    date: new Date('2024-06-15'),
    categoryId: 'personnel',
    budgetId: 'BUD2024001',
    description: 'Monthly salaries for health workers',
    paymentMethod: 'Bank Transfer',
    supportingDocuments: ['payroll_june_2024.pdf', 'salary_breakdown.xlsx'],
    approvedBy: 'Finance Manager',
    status: 'approved',
    isCompliant: true,
    notes: 'Regular monthly payroll',
  },
  {
    id: 'EXP002',
    amount: 8500,
    date: new Date('2024-06-20'),
    categoryId: 'vaccines',
    budgetId: 'BUD2024001',
    description: 'BCG vaccine procurement',
    paymentMethod: 'Purchase Order',
    supportingDocuments: ['vaccine_invoice_001.pdf'],
    status: 'pending',
    isCompliant: true,
    notes: 'Urgent procurement for upcoming campaign',
  },
  {
    id: 'EXP003',
    amount: 15000,
    date: new Date('2024-06-18'),
    categoryId: 'administration',
    budgetId: 'BUD2024001',
    description: 'Office supplies and equipment',
    paymentMethod: 'Credit Card',
    supportingDocuments: ['office_supplies_receipt.pdf'],
    status: 'approved',
    isCompliant: false,
    notes: 'Exceeds monthly admin budget limit',
  },
  {
    id: 'EXP004',
    amount: 12000,
    date: new Date('2024-06-22'),
    categoryId: 'community-outreach',
    budgetId: 'BUD2024001',
    description: 'Community education materials',
    paymentMethod: 'Cash',
    supportingDocuments: ['materials_receipt.pdf', 'distribution_list.pdf'],
    status: 'approved',
    isCompliant: true,
  },
];

const ExpenseForm = ({ onSubmit }: { onSubmit: (expense: Partial<Expense>) => void }) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    description: '',
    paymentMethod: '',
    notes: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [complianceWarnings, setComplianceWarnings] = useState<string[]>([]);

  const handleAmountChange = (amount: string) => {
    setFormData({ ...formData, amount });
    checkCompliance(parseFloat(amount), formData.categoryId);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId });
    if (formData.amount) {
      checkCompliance(parseFloat(formData.amount), categoryId);
    }
  };

  const checkCompliance = (amount: number, categoryId: string) => {
    if (!amount || !categoryId) {
      setComplianceWarnings([]);
      return;
    }

    const warnings: string[] = [];
    const category = BUDGET_CATEGORIES.find(c => c.id === categoryId);

    // Check if expense is unusually large
    if (amount > 50000) {
      warnings.push('Large expense amount - requires additional approval');
    }

    // Check against constraints (simplified)
    const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === categoryId);
    if (constraint?.isHard && constraint.type === 'max') {
      warnings.push(`This category has strict spending limits (${constraint.percentage}% max)`);
    }

    setComplianceWarnings(warnings);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      supportingDocuments: uploadedFiles,
      status: 'pending',
      isCompliant: complianceWarnings.length === 0,
      id: `EXP${Math.random().toString().slice(2, 5)}`,
      budgetId: 'BUD2024001',
    });

    // Reset form
    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      description: '',
      paymentMethod: '',
      notes: '',
    });
    setUploadedFiles([]);
    setComplianceWarnings([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {complianceWarnings.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription>
            <ul className="list-disc ml-4">
              {complianceWarnings.map((warning, index) => (
                <li key={index} className="text-orange-700">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (Kina) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Budget Category *</Label>
          <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_CATEGORIES.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
              <SelectItem value="Purchase Order">Purchase Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the expense"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes or comments"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="documents">Supporting Documents</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              id="documents"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
            <label
              htmlFor="documents"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to upload files or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, Images, Word, Excel files up to 10MB
              </span>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files:</Label>
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileName)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Receipt className="h-4 w-4 mr-2" />
          Record Expense
        </Button>
      </div>
    </form>
  );
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleExpenseSubmit = (newExpense: Partial<Expense>) => {
    setExpenses([newExpense as Expense, ...expenses]);
    setShowExpenseForm(false);
  };

  const filteredExpenses = expenses.filter(expense => {
    const category = BUDGET_CATEGORIES.find(c => c.id === expense.categoryId);

    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || expense.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    const matchesCompliance = filterCompliance === 'all' ||
                             (filterCompliance === 'compliant' && expense.isCompliant) ||
                             (filterCompliance === 'non-compliant' && !expense.isCompliant);

    return matchesSearch && matchesCategory && matchesStatus && matchesCompliance;
  });

  // Calculate statistics
  const stats = {
    total: expenses.length,
    totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    pending: expenses.filter(e => e.status === 'pending').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
    nonCompliant: expenses.filter(e => !e.isCompliant).length,
    thisMonth: expenses.filter(e => {
      const now = new Date();
      return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracking</h1>
          <p className="text-muted-foreground">
            Record and monitor expenses with compliance checking
          </p>
        </div>

        <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Expense</DialogTitle>
              <DialogDescription>
                Add a new expense with supporting documentation and compliance checking.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm onSubmit={handleExpenseSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All recorded expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      {stats.nonCompliant > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>{stats.nonCompliant} non-compliant expense(s) found.</strong> Review these expenses for budget constraint violations or missing documentation.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description, ID, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {BUDGET_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCompliance} onValueChange={setFilterCompliance}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records ({filteredExpenses.length})</CardTitle>
          <CardDescription>
            Complete history of recorded expenses and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => {
                  const category = BUDGET_CATEGORIES.find(c => c.id === expense.categoryId);

                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.id}</TableCell>
                      <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.paymentMethod}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{category?.name}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        K{expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                          expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {expense.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expense.isCompliant ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compliant
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Issues
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or record a new expense.
              </p>
              <Button onClick={() => setShowExpenseForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Record First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
