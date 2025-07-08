'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Calendar,
  DollarSign,
  Receipt,
  Activity,
  Shield,
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  User,
  Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import NotificationSystem from './NotificationSystem';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
    description: 'Overview and key metrics',
  },
  {
    name: 'Provincial Statistics',
    href: '/provinces',
    icon: Map,
    description: 'Province-level immunization statistics',
  },
  {
    name: 'Child Registry',
    href: '/children',
    icon: Users,
    description: 'Register and manage children',
  },
  {
    name: 'Vaccine Schedule',
    href: '/vaccines',
    icon: Calendar,
    description: 'Immunization schedules and tracking',
  },
  {
    name: 'Budget Management',
    href: '/budget',
    icon: DollarSign,
    description: 'Budget allocation and tracking',
  },
  {
    name: 'Expense Tracking',
    href: '/expenses',
    icon: Receipt,
    description: 'Record and monitor expenses',
  },
  {
    name: 'Activities',
    href: '/activities',
    icon: Activity,
    description: 'Outreach and operational activities',
  },
  {
    name: 'Governance',
    href: '/governance',
    icon: Shield,
    description: 'Meetings and compliance tracking',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Generate and view reports',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System configuration',
  },
];

// Child Protection Shield Icon Component
const ChildProtectionLogo = ({ className = "h-8 w-8" }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Shield Background */}
      <path
        d="M50 10L20 25V45C20 65 35 80 50 90C65 80 80 65 80 45V25L50 10Z"
        fill="url(#shieldGradient)"
        stroke="#0EA5E9"
        strokeWidth="2"
      />

      {/* Child Figure */}
      <circle cx="50" cy="35" r="8" fill="white" stroke="#0EA5E9" strokeWidth="1.5"/>
      <path
        d="M35 55C35 45 42 40 50 40C58 40 65 45 65 55V65H35V55Z"
        fill="white"
        stroke="#0EA5E9"
        strokeWidth="1.5"
      />

      {/* Medical Cross */}
      <path
        d="M48 70H52V78H48V70Z M44 72H56V76H44V72Z"
        fill="#10B981"
      />

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const NavItems = () => (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
              isActive
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive ? 'text-white' : 'text-muted-foreground group-hover:text-blue-600'
              )}
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className={cn(
                "text-xs opacity-75",
                isActive ? 'text-blue-100' : 'text-muted-foreground group-hover:text-blue-600'
              )}>{item.description}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center space-x-3 text-white">
                <ChildProtectionLogo className="h-10 w-10" />
                <div>
                  <h1 className="font-bold text-lg">CIMGS</h1>
                  <p className="text-xs text-blue-100">Child Immunization & Health</p>
                </div>
              </div>
            </div>
            <NavItems />

            {/* UNICEF Partnership Badge */}
            <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-green-50">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">In Partnership With</div>
                <div className="font-semibold text-sm text-blue-600">UNICEF & WHO</div>
                <div className="text-xs text-green-600 mt-1">Every Child Protected</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r bg-white shadow-lg">
            <div className="flex items-center justify-center h-16 px-4 border-b bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center space-x-3 text-white">
                <ChildProtectionLogo className="h-10 w-10" />
                <div>
                  <h1 className="font-bold text-lg">CIMGS</h1>
                  <p className="text-xs text-blue-100">Child Immunization & Health</p>
                </div>
              </div>
            </div>
            <NavItems />

            {/* UNICEF Partnership Badge */}
            <div className="p-4 border-t bg-gradient-to-r from-blue-50 to-green-50">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">In Partnership With</div>
                <div className="font-semibold text-sm text-blue-600">UNICEF & WHO</div>
                <div className="text-xs text-green-600 mt-1">Every Child Protected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b shadow-sm">
          <button
            className="px-4 border-r text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden hover:bg-blue-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center bg-gradient-to-r from-white to-blue-50">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h2>
              <div className="text-sm text-blue-600">
                Child Health Monitoring System
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Notifications */}
              <NotificationSystem />

              {/* User menu */}
              <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                <span className="hidden md:inline text-gray-700">Health Officer</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-white via-blue-50/30 to-green-50/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zM10 10c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="py-6 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
