import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import LowStockAlerts from './components/LowStockAlerts';
import Categories from './components/Categories';
import Reports from './components/Reports';
import {
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      if (userMenuOpen) setUserMenuOpen(false);
      if (notifOpen) setNotifOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen, notifOpen]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <InventoryTable />;
      case 'alerts': return <LowStockAlerts />;
      case 'categories': return <Categories />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative">
            <Sidebar
              currentPage={currentPage}
              setCurrentPage={navigateTo}
              collapsed={false}
              setCollapsed={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Left: Mobile Menu + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 capitalize">{currentPage === 'alerts' ? 'Stock Alerts' : currentPage}</h1>
              </div>
            </div>

            {/* Search - Desktop */}
            <div className="hidden items-center gap-3 md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-56 rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 lg:w-64"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      <p className="text-xs text-indigo-200">3 unread notifications</p>
                    </div>
                    <div className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
                      <NotificationItem title="Low Stock Alert" desc="Noise Cancelling Headphones is critically low (3 units)" time="2m ago" unread />
                      <NotificationItem title="Restock Complete" desc="Standing Desk Electric has been restocked to 20 units" time="1h ago" unread />
                      <NotificationItem title="New Product Added" desc={"MacBook Pro 14\u201d added to Electronics category"} time="3h ago" unread />
                      <NotificationItem title="Report Generated" desc="Monthly inventory report for December is ready" time="5h ago" />
                    </div>
                    <button className="w-full border-t border-gray-100 py-2.5 text-center text-sm font-medium text-indigo-600 hover:bg-gray-50">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>

              {/* Settings - Desktop */}
              <button className="hidden h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 xl:flex">
                <Settings className="h-5 w-5" />
              </button>

              <div className="h-8 w-px bg-gray-200 mx-1" />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2.5 rounded-xl py-1.5 pr-3 pl-1.5 transition-colors hover:bg-gray-100"
                >
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                      <span className="text-lg">{user?.avatar || '👤'}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          <span className="text-xl">{user?.avatar || '👤'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="truncate text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

function NotificationItem({ title, desc, time, unread }) {
  return (
    <div className={`flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${unread ? 'bg-indigo-50/50' : ''}`}>
      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${unread ? 'bg-indigo-600' : 'bg-gray-300'}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
        <p className="mt-1 text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 animate-spin items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/30" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Loading StockFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <InventoryProvider>
      <MainApp />
    </InventoryProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
