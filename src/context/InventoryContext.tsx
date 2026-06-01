import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialInventory } from '../data/inventoryData.js';

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

type InventoryContextType = {
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getStatus: (quantity: number, minStock: number) => string;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactElement }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventoryData');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
  }, [inventory]);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => {
      const id = `INV-${String(prev.length + 1).padStart(3, '0')}`;
      return [...prev, { ...item, id }];
    });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              ...updates,
              status: getStatus(
                updates.quantity ?? item.quantity,
                updates.minStock ?? item.minStock
              ),
            }
          : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, []);

  const getStatus = (quantity: number, minStock: number) => {
    if (quantity <= minStock * 0.3) return 'Critical';
    if (quantity < minStock) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <InventoryContext.Provider value={{ inventory, addItem, updateItem, deleteItem, getStatus }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
}
