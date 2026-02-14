'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ItemType = 'watch' | 'sneaker' | 'camera' | 'sculpture';

export interface Item {
  id: string;
  name: string;
  brand: string;
  type: ItemType;
  category: string;
  color: string;
  date: string;
  glbSrc: string;
  poster?: string;
  description?: string;
}

interface CollectionContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'date'>) => void;
  getItemById: (id: string) => Item | undefined;
  getCategories: () => string[];
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

const initialItems: Item[] = [
  {
    id: '1',
    name: 'Vintage Watch',
    brand: 'Horology Co.',
    type: 'watch',
    category: 'Watch',
    color: '#8B4513',
    date: '2024-01-15',
    glbSrc: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: 'A classic timepiece with a rich history and timeless design.'
  },
  {
    id: '2',
    name: 'Materials Shoe',
    brand: 'Stride',
    type: 'sneaker',
    category: 'Sneaker',
    color: '#E5E5E5',
    date: '2024-02-01',
    glbSrc: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb',
    description: 'Lightweight performance sneakers for the modern explorer.'
  }
];

const STORAGE_KEY = 'objectory_collection_v2'; // Versioning storage for new schema

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved collection', e);
        setItems(initialItems);
      }
    } else {
      setItems(initialItems);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (newItem: Omit<Item, 'id' | 'date'>) => {
    const item: Item = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
    };
    setItems((prev) => [item, ...prev]);
  };

  const getItemById = (id: string) => items.find((item) => item.id === id);

  const getCategories = () => {
    return Array.from(new Set(items.map(item => item.category)));
  };

  return (
    <CollectionContext.Provider value={{ items, addItem, getItemById, getCategories }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
