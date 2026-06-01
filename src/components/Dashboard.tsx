import { useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  supplier: string;
  location: string;
  status: string;
  lastRestocked: string;
};

type MonthlyData = { month: string; items: number; value: number };

export default function Dashboard() {
  const { inventory } = useInventory();

  const stats = useMemo(() => {
    const totalItems = inventory.reduce((sum: number, item: InventoryItem) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum: number, item: InventoryItem) => sum + item.quantity * item.price, 0);
    const lowStockItems = inventory.filter(
      (item: InventoryItem) => item.status === 'Low Stock' || item.status === 'Critical'
    );
    const categories = [...new Set(inventory.map((item: InventoryItem) => item.category))];
    const recentActivity = [...inventory]
      .sort((a, b) => new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime())
      .slice(0, 5);
    const topItems = [...inventory]
      .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
      .slice(0, 5);

    return { totalItems, totalValue, lowStockCount: lowStockItems.length, categoryCount: categories.length, recentActivity, topItems };
  }, [inventory]);

  const monthlyData: MonthlyData[] = [
    { month: 'Jul', items: 820, value: 142000 },
    { month: 'Aug', items: 940, value: 158000 },
    { month: 'Sep', items: 870, value: 135000 },
    { month: 'Oct', items: 1050, value: 175000 },
    { month: 'Nov', items: 1120, value: 188000 },
    { month: 'Dec', items: 980, value: 165000 },
    { month: 'Jan', items: stats.totalItems, value: stats.totalValue },
  ];

  const maxItems = Math.max(...monthlyData.map((d) => d.items));

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Items" value={stats.totalItems.toLocaleString()} icon={Package} iconColor="bg-blue-50 text-blue-600" change="+12.5%" changeType="up" description="Across all warehouses" />
        <StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={DollarSign} iconColor="bg-green-50 text-green-600" change="+8.2%" changeType="up" description="Current inventory value" />
        <StatCard title="Low Stock Alerts" value={stats.lowStockCount.toString()} icon={AlertTriangle} iconColor="bg-red-50 text-red-600" change="-3.1%" changeType="down" description="Items below minimum" />
        <StatCard title="Categories" value={stats.categoryCount.toString()} icon={TrendingUp} iconColor="bg-purple-50 text-purple-600" change="+1" changeType="up" description="Active product categories" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Monthly Inventory Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Monthly Inventory Trend</h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">Items in stock over the last 7 months</p>
          <div className="mt-4 flex items-end gap-2 sm:mt-6 sm:gap-3">
            {monthlyData.map((data, index) => {
              const height = (data.items / maxItems) * 120;
              const isCurrent = index === monthlyData.length - 1;
              return (
                <div key={data.month} className="flex flex-1 flex-col items-center gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-600">{data.items.toLocaleString()}</span>
                  <div className={`w-full rounded-t-lg transition-all duration-500 ${isCurrent ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200'}`} style={{ height: `${height}px` }} />
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Category Distribution</h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">Items by category</p>
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {[...new Set(inventory.map((i: InventoryItem) => i.category))].map((cat) => {
              const items = inventory.filter((i: InventoryItem) => i.category === cat);
              const total = items.reduce((s: number, i: InventoryItem) => s + i.quantity, 0);
              const percentage = stats.totalItems > 0 ? Math.round((total / stats.totalItems) * 100) : 0;
              const colors: Record<string, { bg: string; text: string }> = {
                Electronics: { bg: 'bg-blue-500', text: 'text-blue-700' },
                Furniture: { bg: 'bg-emerald-500', text: 'text-emerald-700' },
                Accessories: { bg: 'bg-amber-500', text: 'text-amber-700' },
              };
              const c = colors[cat] || { bg: 'bg-gray-500', text: 'text-gray-700' };
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">{cat}</span>
                    <span className={`text-xs font-semibold sm:text-sm ${c.text}`}>{percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 sm:h-2.5">
                    <div className={`h-2 rounded-full transition-all duration-700 sm:h-2.5 ${c.bg}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Value Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Top Value Items</h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">Highest inventory value products</p>
          <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
            {stats.topItems.map((item: InventoryItem, index: number) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-gray-200 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">${(item.quantity * item.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.quantity} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Recent Activity</h3>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">Latest restocked items</p>
          <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
            {stats.recentActivity.map((item: InventoryItem) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 sm:h-9 sm:w-9">
                    <Clock className="h-3.5 w-3.5 text-indigo-600 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">{item.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">Restocked</p>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    {new Date(item.lastRestocked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, iconColor, change, changeType, description }: { title: string; value: string; icon: React.ComponentType<{ className?: string }>; iconColor: string; change: string; changeType: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold sm:text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'up' ? <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          {change}
        </span>
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}
