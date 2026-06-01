import { useState, useMemo, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Filter, Package, DollarSign, ArrowUpDown, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import InventoryModal from './InventoryModal';

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
  image?: string;
};

export default function InventoryTable() {
  const { inventory, addItem, updateItem, deleteItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const filteredInventory = useMemo(() => {
    let result = [...inventory];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term) || item.supplier.toLowerCase().includes(term));
    }
    if (filterCategory !== 'All') result = result.filter((item) => item.category === filterCategory);
    if (filterStatus !== 'All') result = result.filter((item) => item.status === filterStatus);
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'quantity') comparison = a.quantity - b.quantity;
      else if (sortBy === 'price') comparison = a.price - b.price;
      else if (sortBy === 'value') comparison = a.quantity * a.price - b.quantity * b.price;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [inventory, searchTerm, filterCategory, filterStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortOrder('asc'); }
  }, [sortBy]);

  const handleSubmit = useCallback((data: InventoryItem) => {
    const { id: _id, ...itemData } = data;
    if (editItem) {
      updateItem(editItem.id, data);
    } else {
      addItem(itemData);
    }
    setIsModalOpen(false);
    setEditItem(null);
  }, [editItem, updateItem, addItem]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, React.ReactNode> = {
      'In Stock': <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 sm:px-2.5 sm:py-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /><span className="hidden sm:inline">In Stock</span></span>,
      'Low Stock': <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-600/20 sm:px-2.5 sm:py-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /><span className="hidden sm:inline">Low Stock</span></span>,
      'Critical': <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20 sm:px-2.5 sm:py-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /><span className="hidden sm:inline">Critical</span></span>,
    };
    return badges[status] || null;
  };

  const SortIcon = ({ column }: { column: string }) => (
    <button onClick={() => handleSort(column)} className="ml-1 inline-flex">
      <ArrowUpDown className={`h-3.5 w-3.5 ${sortBy === column ? 'text-indigo-600' : 'text-gray-300'}`} />
    </button>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all your products in one place.</p>
        </div>
        <button onClick={() => { setEditItem(null); setIsModalOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> <span className="sm:hidden">Add</span><span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50"><Package className="h-5 w-5 text-indigo-600" /></div>
            <div><p className="text-sm text-gray-500">Total Products</p><p className="text-xl font-bold text-gray-900">{inventory.length}</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-sm text-gray-500">Total Value</p><p className="text-xl font-bold text-gray-900">${inventory.reduce((s: number, i: InventoryItem) => s + i.quantity * i.price, 0).toLocaleString()}</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50"><span className="text-lg font-bold text-red-600">!</span></div>
            <div><p className="text-sm text-gray-500">Low / Critical</p><p className="text-xl font-bold text-gray-900">{inventory.filter((i: InventoryItem) => i.status !== 'In Stock').length}</p></div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            {/* Search + Filter toggle */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search by name, SKU, or supplier..." className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors sm:hidden ${showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-gray-50 text-gray-700'}`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(filterCategory !== 'All' || filterStatus !== 'All') && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                    {(filterCategory !== 'All' ? 1 : 0) + (filterStatus !== 'All' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdowns - Desktop always shows, mobile toggleable */}
            <div className={`flex flex-col gap-3 sm:flex-row sm:items-center ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
              <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
              </select>
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>
              {(filterCategory !== 'All' || filterStatus !== 'All') && (
                <button onClick={() => { setFilterCategory('All'); setFilterStatus('All'); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <X className="h-3.5 w-3.5" /> Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-600"><div className="flex items-center">Product<SortIcon column="name" /></div></th>
                <th className="hidden px-4 py-3 font-semibold text-gray-600 xl:table-cell">SKU</th>
                <th className="hidden px-4 py-3 font-semibold text-gray-600 lg:table-cell">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600"><div className="flex items-center">Qty<SortIcon column="quantity" /></div></th>
                <th className="hidden px-4 py-3 font-semibold text-gray-600 xl:table-cell">Price</th>
                <th className="px-4 py-3 font-semibold text-gray-600"><div className="flex items-center">Value<SortIcon column="value" /></div></th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedInventory.map((item: InventoryItem) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 xl:table-cell"><span className="font-mono text-xs text-gray-500">{item.sku}</span></td>
                  <td className="hidden px-4 py-3 lg:table-cell"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{item.category}</span></td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${item.status === 'Critical' ? 'text-red-600' : item.status === 'Low Stock' ? 'text-yellow-600' : 'text-gray-900'}`}>{item.quantity}</span>
                  </td>
                  <td className="hidden px-4 py-3 xl:table-cell"><span className="text-gray-700">${item.price.toFixed(2)}</span></td>
                  <td className="px-4 py-3"><span className="font-semibold text-gray-900">${(item.quantity * item.price).toLocaleString()}</span></td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditItem(item); setIsModalOpen(true); }} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600" title="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedInventory.length === 0 && (
            <div className="py-16 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">No products found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Card View - Mobile */}
        <div className="space-y-3 p-3 md:hidden">
          {paginatedInventory.map((item: InventoryItem) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.sku} · {item.category}</p>
                </div>
                {getStatusBadge(item.status)}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-2 text-center">
                  <p className="text-xs text-gray-500">Qty</p>
                  <p className={`text-lg font-bold ${item.status === 'Critical' ? 'text-red-600' : item.status === 'Low Stock' ? 'text-yellow-600' : 'text-gray-900'}`}>{item.quantity}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 text-center">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-bold text-gray-900">${item.price.toFixed(0)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 text-center">
                  <p className="text-xs text-gray-500">Value</p>
                  <p className="text-sm font-bold text-gray-900">${(item.quantity * item.price).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">{item.location}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditItem(item); setIsModalOpen(true); }} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
          {paginatedInventory.length === 0 && (
            <div className="py-16 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-500">No products found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInventory.length)} of {filteredInventory.length} results
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((page, _idx, _arr) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <InventoryModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditItem(null); }} onSubmit={handleSubmit} editItem={editItem} />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><Trash2 className="h-6 w-6 text-red-600" /></div>
            <h3 className="text-center text-lg font-semibold text-gray-900">Delete Product?</h3>
            <p className="mt-2 text-center text-sm text-gray-500">This action cannot be undone. The product will be permanently removed.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { deleteItem(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
