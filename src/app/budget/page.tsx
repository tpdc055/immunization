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
  DollarSign,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Lock,
  Unlock
} from 'lucide-react';
import { Budget, BudgetAllocation, BudgetCategory } from '@/lib/types';
import { BUDGET_CATEGORIES, BUDGET_CONSTRAINTS } from '@/lib/constants';

// Mock data for demonstration
const mockBudget: Budget = {
  id: 'BUD2024001',
  year: 2024,
  totalAmount: 1500000,
  status: 'active',
  createdDate: new Date('2024-01-01'),
  approvedDate: new Date('2024-01-15'),
  categoryAllocations: [
    {
      id: 'BA001',
      budgetId: 'BUD2024001',
      categoryId: 'personnel',
      allocatedAmount: 450000,
      spentAmount: 387500,
      remainingAmount: 62500,
      percentageOfTotal: 30.0,
    },
    {
      id: 'BA002',
      budgetId: 'BUD2024001',
      categoryId: 'vaccines',
      allocatedAmount: 300000,
      spentAmount: 245000,
      remainingAmount: 55000,
      percentageOfTotal: 20.0,
    },
    {
      id: 'BA003',
      budgetId: 'BUD2024001',
      categoryId: 'cold-chain',
      allocatedAmount: 225000,
      spentAmount: 189000,
      remainingAmount: 36000,
      percentageOfTotal: 15.0,
    },
    {
      id: 'BA004',
      budgetId: 'BUD2024001',
      categoryId: 'community-outreach',
      allocatedAmount: 300000,
      spentAmount: 198000,
      remainingAmount: 102000,
      percentageOfTotal: 20.0,
    },
    {
      id: 'BA005',
      budgetId: 'BUD2024001',
      categoryId: 'monitoring-evaluation',
      allocatedAmount: 75000,
      spentAmount: 67500,
      remainingAmount: 7500,
      percentageOfTotal: 5.0,
    },
    {
      id: 'BA006',
      budgetId: 'BUD2024001',
      categoryId: 'administration',
      allocatedAmount: 150000,
      spentAmount: 91500,
      remainingAmount: 58500,
      percentageOfTotal: 10.0,
    },
  ],
};

const BudgetAllocationForm = ({
  budget,
  onSubmit
}: {
  budget?: Budget;
  onSubmit: (allocation: Partial<BudgetAllocation>) => void;
}) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    allocatedAmount: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.allocatedAmount);
    const newErrors: string[] = [];

    // Validate constraint compliance
    const category = BUDGET_CATEGORIES.find(c => c.id === formData.categoryId);
    const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === formData.categoryId);

    if (constraint && budget) {
      const percentage = (amount / budget.totalAmount) * 100;

      if (constraint.type === 'max' && percentage > constraint.percentage) {
        newErrors.push(
          `${category?.name} allocation (${percentage.toFixed(1)}%) exceeds maximum limit of ${constraint.percentage}%`
        );
      }

      if (constraint.type === 'min' && percentage < constraint.percentage) {
        newErrors.push(
          `${category?.name} allocation (${percentage.toFixed(1)}%) is below minimum requirement of ${constraint.percentage}%`
        );
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const percentageOfTotal = budget ? (amount / budget.totalAmount) * 100 : 0;

    onSubmit({
      categoryId: formData.categoryId,
      allocatedAmount: amount,
      spentAmount: 0,
      remainingAmount: amount,
      percentageOfTotal,
    });

    setFormData({ categoryId: '', allocatedAmount: '' });
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <ul className="list-disc ml-4">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Budget Category *</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
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
          <Label htmlFor="allocatedAmount">Allocated Amount (Kina) *</Label>
          <Input
            id="allocatedAmount"
            type="number"
            value={formData.allocatedAmount}
            onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {/* Constraint Information */}
      {formData.categoryId && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Budget Constraints</h4>
          {(() => {
            const category = BUDGET_CATEGORIES.find(c => c.id === formData.categoryId);
            const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === formData.categoryId);

            if (!constraint) {
              return <p className="text-sm text-muted-foreground">No constraints for this category</p>;
            }

            return (
              <div className="text-sm space-y-1">
                <div className="flex items-center">
                  {constraint.isHard ? (
                    <Lock className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <Unlock className="h-4 w-4 text-orange-500 mr-2" />
                  )}
                  <span>
                    {constraint.type === 'max' ? 'Maximum' : 'Minimum'} {constraint.percentage}%
                    ({constraint.isHard ? 'Hard' : 'Soft'} constraint)
                  </span>
                </div>
                <p className="text-muted-foreground">{category?.description}</p>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Allocation
        </Button>
      </div>
    </form>
  );
};

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget>(mockBudget);
  const [showAllocationForm, setShowAllocationForm] = useState(false);

  const handleAllocation = (newAllocation: Partial<BudgetAllocation>) => {
    // This would typically be handled by the backend
    console.log('New allocation:', newAllocation);
    setShowAllocationForm(false);
  };

  const totalAllocated = budget.categoryAllocations.reduce((sum, allocation) => sum + allocation.allocatedAmount, 0);
  const totalSpent = budget.categoryAllocations.reduce((sum, allocation) => sum + allocation.spentAmount, 0);
  const totalRemaining = budget.categoryAllocations.reduce((sum, allocation) => sum + allocation.remainingAmount, 0);

  const utilizationPercentage = (totalSpent / totalAllocated) * 100;
  const allocationPercentage = (totalAllocated / budget.totalAmount) * 100;

  // Check for constraint violations
  const violations = budget.categoryAllocations.filter(allocation => {
    const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === allocation.categoryId);
    if (!constraint) return false;

    if (constraint.type === 'max' && allocation.percentageOfTotal > constraint.percentage) {
      return true;
    }
    if (constraint.type === 'min' && allocation.percentageOfTotal < constraint.percentage) {
      return true;
    }
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-muted-foreground">
            Manage budget allocations and monitor spending compliance
          </p>
        </div>

        <Dialog open={showAllocationForm} onOpenChange={setShowAllocationForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Allocation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Budget Allocation</DialogTitle>
              <DialogDescription>
                Allocate budget to a specific category with constraint checking.
              </DialogDescription>
            </DialogHeader>
            <BudgetAllocationForm budget={budget} onSubmit={handleAllocation} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{budget.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              2024 Annual Budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{totalAllocated.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">{allocationPercentage.toFixed(1)}% of total budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{totalSpent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">{utilizationPercentage.toFixed(1)}% utilization</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{totalRemaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available for spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Constraint Violations Alert */}
      {violations.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>{violations.length} budget constraint violation(s) detected:</strong>
            <ul className="list-disc ml-4 mt-2">
              {violations.map((violation) => {
                const category = BUDGET_CATEGORIES.find(c => c.id === violation.categoryId);
                const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === violation.categoryId);
                return (
                  <li key={violation.id} className="text-red-700">
                    {category?.name}: {violation.percentageOfTotal.toFixed(1)}%
                    {constraint?.type === 'max' ? ' exceeds maximum' : ' below minimum'} of {constraint?.percentage}%
                  </li>
                );
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="allocations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocations">Budget Allocations</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocations by Category</CardTitle>
              <CardDescription>
                Current budget allocation and spending by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Allocated</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budget.categoryAllocations.map((allocation) => {
                      const category = BUDGET_CATEGORIES.find(c => c.id === allocation.categoryId);
                      const constraint = BUDGET_CONSTRAINTS.find(c => c.categoryId === allocation.categoryId);
                      const utilizationPercent = (allocation.spentAmount / allocation.allocatedAmount) * 100;

                      const hasViolation = constraint && (
                        (constraint.type === 'max' && allocation.percentageOfTotal > constraint.percentage) ||
                        (constraint.type === 'min' && allocation.percentageOfTotal < constraint.percentage)
                      );

                      return (
                        <TableRow key={allocation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{category?.name}</div>
                              <div className="text-sm text-muted-foreground">{category?.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            K{allocation.allocatedAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            K{allocation.spentAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            K{allocation.remainingAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {allocation.percentageOfTotal.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm">{utilizationPercent.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {hasViolation ? (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Violation
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Compliant
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
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Constraints</CardTitle>
              <CardDescription>
                Defined constraints for budget allocation limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Constraint Type</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Enforcement</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BUDGET_CONSTRAINTS.map((constraint) => {
                      const category = BUDGET_CATEGORIES.find(c => c.id === constraint.categoryId);
                      const allocation = budget.categoryAllocations.find(a => a.categoryId === constraint.categoryId);
                      const currentPercentage = allocation?.percentageOfTotal || 0;

                      const isCompliant = constraint.type === 'max'
                        ? currentPercentage <= constraint.percentage
                        : currentPercentage >= constraint.percentage;

                      return (
                        <TableRow key={constraint.categoryId}>
                          <TableCell className="font-medium">{category?.name}</TableCell>
                          <TableCell className="capitalize">
                            {constraint.type}imum {constraint.percentage}%
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {constraint.percentage}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              isCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }>
                              {currentPercentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {constraint.isHard ? (
                                <>
                                  <Lock className="h-4 w-4 text-red-500 mr-2" />
                                  <span className="text-red-600">Hard</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-4 w-4 text-orange-500 mr-2" />
                                  <span className="text-orange-600">Soft</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isCompliant ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Compliant
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Violation
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Distribution</CardTitle>
                <CardDescription>
                  Percentage allocation by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budget.categoryAllocations.map((allocation) => {
                    const category = BUDGET_CATEGORIES.find(c => c.id === allocation.categoryId);
                    return (
                      <div key={allocation.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category?.name}</span>
                          <span>{allocation.percentageOfTotal.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${allocation.percentageOfTotal}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>K{allocation.allocatedAmount.toLocaleString()}</span>
                          <span>K{allocation.spentAmount.toLocaleString()} spent</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Analysis</CardTitle>
                <CardDescription>
                  Budget utilization trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">Overall Utilization</div>
                      <div className="text-sm text-muted-foreground">
                        {totalSpent.toLocaleString()} of {totalAllocated.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {utilizationPercentage.toFixed(1)}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Spending Categories</h4>
                    {budget.categoryAllocations
                      .sort((a, b) => b.spentAmount - a.spentAmount)
                      .slice(0, 3)
                      .map((allocation, index) => {
                        const category = BUDGET_CATEGORIES.find(c => c.id === allocation.categoryId);
                        const utilizationPercent = (allocation.spentAmount / allocation.allocatedAmount) * 100;

                        return (
                          <div key={allocation.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mr-3">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{category?.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  K{allocation.spentAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {utilizationPercent.toFixed(1)}%
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
