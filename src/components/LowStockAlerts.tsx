import { useMemo } from 'react';
import { AlertTriangle, AlertCircle, TrendingDown, Clock, MapPin, Package } from 'lucide-react';
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

export default function LowStockAlerts() {
  const { inventory, updateItem } = useInventory();

  const alerts = useMemo(() => {
    return inventory
      .filter((item: InventoryItem) => item.status === 'Low Stock' || item.status === 'Critical')
      .sort((a: InventoryItem, b: InventoryItem) => {
        if (a.status === 'Critical' && b.status !== 'Critical') return -1;
        if (a.status !== 'Critical' && b.status === 'Critical') return 1;
        return a.quantity / a.minStock - b.quantity / b.minStock;
      });
  }, [inventory]);

  const handleRestock = (item: InventoryItem) => {
    const newQuantity = item.minStock * 2;
    updateItem(item.id, { quantity: newQuantity, lastRestocked: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Stock Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">Items that need immediate attention and restocking.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 sm:h-12 sm:w-12"><AlertCircle className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" /></div>
            <div><p className="text-2xl font-bold text-red-700 sm:text-3xl">{inventory.filter((i: InventoryItem) => i.status === 'Critical').length}</p><p className="text-sm font-medium text-red-600">Critical Stock</p></div>
          </div>
          <p className="mt-2 text-xs text-red-500">Items below 30% of minimum stock level</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 sm:h-12 sm:w-12"><AlertTriangle className="h-5 w-5 text-yellow-600 sm:h-6 sm:w-6" /></div>
            <div><p className="text-2xl font-bold text-yellow-700 sm:text-3xl">{inventory.filter((i: InventoryItem) => i.status === 'Low Stock').length}</p><p className="text-sm font-medium text-yellow-600">Low Stock</p></div>
          </div>
          <p className="mt-2 text-xs text-yellow-600">Items below minimum stock level</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center sm:p-16">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16"><Package className="h-7 w-7 text-green-600 sm:h-8 sm:w-8" /></div>
          <h3 className="text-lg font-semibold text-gray-900">All Clear!</h3>
          <p className="mt-1 text-sm text-gray-500">All products are well stocked. No alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {alerts.map((item: InventoryItem) => {
            const isCritical = item.status === 'Critical';
            const stockLevel = Math.min((item.quantity / item.minStock) * 100, 100);
            return (
              <div key={item.id} className={`rounded-xl border p-4 transition-all hover:shadow-md sm:p-5 ${isCritical ? 'border-red-200 bg-white' : 'border-yellow-200 bg-white'}`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${isCritical ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      {isCritical ? <AlertCircle className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" /> : <AlertTriangle className="h-5 w-5 text-yellow-600 sm:h-6 sm:w-6" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{item.name}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${isCritical ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sku} · {item.category}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-400 sm:mt-2 sm:gap-4">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(item.lastRestocked).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pl-14 sm:flex-col sm:items-end sm:pl-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1"><TrendingDown className="h-4 w-4 text-red-500" /><span className="text-xl font-bold text-gray-900">{item.quantity}</span><span className="text-sm text-gray-400">/ {item.minStock}</span></div>
                      <p className="text-xs text-gray-400">Current / Min</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500"><span>Stock Level</span><span className="font-medium">{Math.round(stockLevel)}%</span></div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-2 rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${stockLevel}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex flex-col-reverse items-center gap-2 sm:mt-4 sm:flex-row sm:justify-between">
                  <span className="text-xs text-gray-400">Supplier: <span className="font-medium text-gray-600">{item.supplier}</span></span>
                  <button onClick={() => handleRestock(item)} className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto">Restock to {item.minStock * 2}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
