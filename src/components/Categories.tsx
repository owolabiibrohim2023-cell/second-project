import { useMemo } from 'react';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
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

const categoryConfig: Record<string, { gradient: string; bg: string; text: string; emoji: string }> = {
  Electronics: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', emoji: '💻' },
  Furniture: { gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600', emoji: '🪑' },
  Accessories: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', emoji: '🖱️' },
};

export default function Categories() {
  const { inventory } = useInventory();

  const categoriesData = useMemo(() => {
    return [...new Set(inventory.map((item: InventoryItem) => item.category))].map((cat) => {
      const items = inventory.filter((item: InventoryItem) => item.category === cat);
      const totalQuantity = items.reduce((sum: number, i: InventoryItem) => sum + i.quantity, 0);
      const totalValue = items.reduce((sum: number, i: InventoryItem) => sum + i.quantity * i.price, 0);
      const avgPrice = totalQuantity > 0 ? totalValue / totalQuantity : 0;
      const lowStock = items.filter((i: InventoryItem) => i.status === 'Low Stock' || i.status === 'Critical').length;
      const topItem = [...items].sort((a: InventoryItem, b: InventoryItem) => b.quantity * b.price - a.quantity * a.price)[0];
      return { name: cat, items, totalQuantity, totalValue, avgPrice, lowStock, topItem, config: categoryConfig[cat] || { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', text: 'text-gray-600', emoji: '📦' } };
    });
  }, [inventory]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and manage inventory by product categories.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((cat) => {
          const c = cat.config;
          return (
            <div key={cat.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg">
              <div className={`bg-gradient-to-r ${c.gradient} px-5 py-4 sm:px-6 sm:py-5`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">{c.emoji}</span>
                  <div><h3 className="text-base font-bold text-white sm:text-lg">{cat.name}</h3><p className="text-xs text-white/80 sm:text-sm">{cat.items.length} products</p></div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className={`rounded-xl ${c.bg} p-2.5 sm:p-3`}>
                    <div className="flex items-center gap-1.5 sm:gap-2"><Package className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.text}`} /><span className="text-xs text-gray-500">Total Qty</span></div>
                    <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{cat.totalQuantity.toLocaleString()}</p>
                  </div>
                  <div className={`rounded-xl ${c.bg} p-2.5 sm:p-3`}>
                    <div className="flex items-center gap-1.5 sm:gap-2"><DollarSign className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.text}`} /><span className="text-xs text-gray-500">Value</span></div>
                    <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">${cat.totalValue.toLocaleString()}</p>
                  </div>
                  <div className={`rounded-xl ${c.bg} p-2.5 sm:p-3`}>
                    <div className="flex items-center gap-1.5 sm:gap-2"><TrendingUp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.text}`} /><span className="text-xs text-gray-500">Avg</span></div>
                    <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">${cat.avgPrice.toFixed(0)}</p>
                  </div>
                  <div className={`rounded-xl ${c.bg} p-2.5 sm:p-3`}>
                    <div className="flex items-center gap-1.5 sm:gap-2"><AlertTriangle className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${c.text}`} /><span className="text-xs text-gray-500">Alerts</span></div>
                    <p className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{cat.lowStock}</p>
                  </div>
                </div>
                {cat.topItem && (
                  <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-2.5 sm:mt-4 sm:p-3">
                    <p className="text-xs font-medium text-gray-500">Top Product</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{cat.topItem.name}</p>
                      <span className="shrink-0 text-xs font-bold text-gray-900 sm:text-sm">${(cat.topItem.quantity * cat.topItem.price).toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <div className="mt-3 sm:mt-4">
                  <p className="mb-2 text-xs font-medium text-gray-500">Products ({cat.items.length})</p>
                  <div className="space-y-1">
                    {cat.items.slice(0, 3).map((item: InventoryItem) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg px-2 py-1">
                        <span className="truncate text-xs text-gray-700">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${c.text}`}>{item.quantity}</span>
                          {item.status !== 'In Stock' && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                        </div>
                      </div>
                    ))}
                    {cat.items.length > 3 && <p className="text-xs text-gray-400">+{cat.items.length - 3} more</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Items List */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
          <h3 className="text-sm font-semibold text-gray-900 sm:text-base">All Products by Category</h3>
          <p className="text-xs text-gray-500 sm:text-sm">Complete inventory listing organized by category</p>
        </div>
        <div className="divide-y divide-gray-100">
          {categoriesData.map((cat) => {
            const c = cat.config;
            return (
              <div key={cat.name}>
                <div className={`flex items-center gap-2 border-b border-gray-100 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3 ${c.bg}`}>
                  <span>{c.emoji}</span>
                  <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500 ring-1 ring-gray-200">{cat.items.length}</span>
                </div>
                {cat.items.map((item: InventoryItem) => (
                  <div key={item.id} className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sku} · {item.location}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-sm font-semibold text-gray-900">{item.quantity} qty</span>
                      <span className="text-sm font-semibold text-gray-900">${(item.quantity * item.price).toLocaleString()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.status === 'In Stock' ? 'bg-green-50 text-green-700' : item.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
