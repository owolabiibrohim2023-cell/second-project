import { useMemo } from 'react';
import { BarChart3, DollarSign, TrendingUp, MapPin, PieChart, Package } from 'lucide-react';
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

export default function Reports() {
  const { inventory } = useInventory();

  const reportData = useMemo(() => {
    const totalItems = inventory.reduce((s: number, i: InventoryItem) => s + i.quantity, 0);
    const totalValue = inventory.reduce((s: number, i: InventoryItem) => s + i.quantity * i.price, 0);
    const avgItemValue = totalItems > 0 ? totalValue / totalItems : 0;
    const inStock = inventory.filter((i: InventoryItem) => i.status === 'In Stock').length;
    const lowStock = inventory.filter((i: InventoryItem) => i.status === 'Low Stock').length;
    const critical = inventory.filter((i: InventoryItem) => i.status === 'Critical').length;

    const warehouseData: Record<string, { count: number; quantity: number; value: number }> = {};
    inventory.forEach((item: InventoryItem) => {
      if (!warehouseData[item.location]) warehouseData[item.location] = { count: 0, quantity: 0, value: 0 };
      warehouseData[item.location].count++;
      warehouseData[item.location].quantity += item.quantity;
      warehouseData[item.location].value += item.quantity * item.price;
    });

    const supplierData: Record<string, { count: number; value: number }> = {};
    inventory.forEach((item: InventoryItem) => {
      if (!supplierData[item.supplier]) supplierData[item.supplier] = { count: 0, value: 0 };
      supplierData[item.supplier].count++;
      supplierData[item.supplier].value += item.quantity * item.price;
    });

    const topSuppliers = Object.entries(supplierData).sort((a, b) => b[1].value - a[1].value).slice(0, 5);

    const priceRanges = [
      { label: '$0 - $50', min: 0, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 - $200', min: 100, max: 200 },
      { label: '$200 - $500', min: 200, max: 500 },
      { label: '$500 - $1000', min: 500, max: 1000 },
      { label: '$1000+', min: 1000, max: Infinity },
    ];

    const priceDistribution = priceRanges.map((range) => {
      const items = inventory.filter((i: InventoryItem) => i.price >= range.min && i.price < range.max);
      return { label: range.label, count: items.length, quantity: items.reduce((s: number, i: InventoryItem) => s + i.quantity, 0) };
    });

    const maxPriceCount = Math.max(...priceDistribution.map((d) => d.count), 1);

    return { totalItems, totalValue, avgItemValue, inStock, lowStock, critical, warehouseData, topSuppliers, priceDistribution, maxPriceCount, supplierData };
  }, [inventory]);

  const warehouseOrder = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D'];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Comprehensive insights into your inventory performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 sm:h-10 sm:w-10"><Package className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" /></div>
            <div><p className="text-xs text-gray-500">Avg Value</p><p className="text-base font-bold text-gray-900 sm:text-xl">${reportData.avgItemValue.toFixed(2)}</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 sm:h-10 sm:w-10"><TrendingUp className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" /></div>
            <div><p className="text-xs text-gray-500">Health Score</p><p className="text-base font-bold text-green-600 sm:text-xl">{inventory.length > 0 ? Math.round((reportData.inStock / inventory.length) * 100) : 0}%</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 sm:h-10 sm:w-10"><MapPin className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" /></div>
            <div><p className="text-xs text-gray-500">Warehouses</p><p className="text-base font-bold text-gray-900 sm:text-xl">{Object.keys(reportData.warehouseData).length}</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 sm:h-10 sm:w-10"><DollarSign className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" /></div>
            <div><p className="text-xs text-gray-500">Total SKUs</p><p className="text-base font-bold text-gray-900 sm:text-xl">{inventory.length}</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2"><PieChart className="h-5 w-5 text-gray-600" /><h3 className="text-sm font-semibold text-gray-900 sm:text-base">Stock Status Distribution</h3></div>
          <div className="mt-4 flex items-center justify-center sm:mt-6">
            <div className="relative h-36 w-36 sm:h-40 sm:w-40">
              <svg viewBox="0 0 36 36" className="h-36 w-36 -rotate-90 sm:h-40 sm:w-40">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray={`${(reportData.inStock / inventory.length) * 88} 88`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" strokeWidth="5" strokeDasharray={`${(reportData.lowStock / inventory.length) * 88} 88`} strokeDashoffset={`-${(reportData.inStock / inventory.length) * 88}`} />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray={`${(reportData.critical / inventory.length) * 88} 88`} strokeDashoffset={`-${((reportData.inStock + reportData.lowStock) / inventory.length) * 88}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{inventory.length}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" /><span className="text-sm text-gray-600">In Stock</span></div>
              <span className="text-sm font-semibold text-gray-900">{reportData.inStock} ({Math.round((reportData.inStock / inventory.length) * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-500" /><span className="text-sm text-gray-600">Low Stock</span></div>
              <span className="text-sm font-semibold text-gray-900">{reportData.lowStock} ({Math.round((reportData.lowStock / inventory.length) * 100)}%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /><span className="text-sm text-gray-600">Critical</span></div>
              <span className="text-sm font-semibold text-gray-900">{reportData.critical} ({Math.round((reportData.critical / inventory.length) * 100)}%)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-gray-600" /><h3 className="text-sm font-semibold text-gray-900 sm:text-base">Price Range Distribution</h3></div>
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {reportData.priceDistribution.map((range) => (
              <div key={range.label}>
                <div className="flex items-center justify-between text-xs sm:text-sm"><span className="font-medium text-gray-700">{range.label}</span><span className="text-gray-500">{range.count} items · {range.quantity} units</span></div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 sm:h-2.5">
                  <div className="h-2 rounded-full bg-indigo-500 transition-all duration-500 sm:h-2.5" style={{ width: `${(range.count / reportData.maxPriceCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Warehouse Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="pb-3 pl-4 pr-2 font-semibold text-gray-600 sm:px-6">Warehouse</th>
              <th className="pb-3 font-semibold text-gray-600">SKUs</th>
              <th className="pb-3 font-semibold text-gray-600">Units</th>
              <th className="hidden pb-3 font-semibold text-gray-600 sm:table-cell">Value</th>
              <th className="pb-3 pr-4 font-semibold text-gray-600 sm:pr-6">Utilization</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {warehouseOrder.filter((wh) => reportData.warehouseData[wh]).map((wh) => {
                const data = reportData.warehouseData[wh];
                const utilization = Math.min(Math.round((data.quantity / 500) * 100), 100);
                return (
                  <tr key={wh}>
                    <td className="py-3 pl-4 pr-2 sm:px-6"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="font-medium text-gray-900">{wh}</span></div></td>
                    <td className="py-3 text-gray-700">{data.count}</td>
                    <td className="py-3 text-gray-700">{data.quantity.toLocaleString()}</td>
                    <td className="hidden py-3 font-semibold text-gray-900 sm:table-cell">${data.value.toLocaleString()}</td>
                    <td className="py-3 pr-4 sm:pr-6">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-gray-100 sm:w-24">
                          <div className={`h-2 rounded-full ${utilization > 70 ? 'bg-green-500' : utilization > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${utilization}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{utilization}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gray-600" /><h3 className="text-sm font-semibold text-gray-900 sm:text-base">Top Suppliers by Value</h3></div>
        <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-4">
          {reportData.topSuppliers.map(([name, data], index) => (
            <div key={name} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm ${index === 0 ? 'bg-amber-100 text-amber-700' : index === 1 ? 'bg-gray-200 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>{index + 1}</span>
                <div><p className="text-sm font-medium text-gray-900">{name}</p><p className="text-xs text-gray-500">{data.count} products</p></div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm font-semibold text-gray-900">${data.value.toLocaleString()}</span>
                {index === 0 && <TrendingUp className="hidden h-4 w-4 text-green-500 sm:block" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
