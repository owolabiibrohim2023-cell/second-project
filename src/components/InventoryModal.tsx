import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { X, Save } from 'lucide-react';

interface InventoryItem {
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
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryItem) => void;
  editItem: InventoryItem | null;
}

export default function InventoryModal({ isOpen, onClose, onSubmit, editItem }: InventoryModalProps) {
  const [formData, setFormData] = useState<InventoryItem>({
    id: '',
    name: '',
    sku: '',
    category: 'Electronics',
    quantity: 0,
    minStock: 10,
    price: 0,
    supplier: '',
    location: 'Warehouse A',
    status: 'In Stock',
    lastRestocked: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData({
        id: '', name: '', sku: '', category: 'Electronics',
        quantity: 0, minStock: 10, price: 0, supplier: '',
        location: 'Warehouse A', status: 'In Stock',
        lastRestocked: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [editItem, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const status = formData.quantity <= formData.minStock * 0.3
        ? 'Critical' : formData.quantity < formData.minStock ? 'Low Stock' : 'In Stock';
      onSubmit({ ...formData, status });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minStock' || name === 'price' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{editItem ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/20 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} placeholder="Enter product name" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} placeholder="e.g., PRD-001" />
                {errors.sku && <p className="mt-1 text-xs text-red-500">{errors.sku}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="Electronics">Electronics</option><option value="Furniture">Furniture</option><option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} />
                {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Min Stock Level</label>
                <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} min="0" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`} />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Supplier</label>
                <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Supplier name" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Warehouse A">Warehouse A</option><option value="Warehouse B">Warehouse B</option><option value="Warehouse C">Warehouse C</option><option value="Warehouse D">Warehouse D</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Last Restocked</label>
              <input type="date" name="lastRestocked" value={formData.lastRestocked} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"><Save className="h-4 w-4" />{editItem ? 'Update Product' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
