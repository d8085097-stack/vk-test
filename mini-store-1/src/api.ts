import { CoffeeCardType, CoffeeFilterParams } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function getCoffees(): Promise<CoffeeCardType[]> {
  const response = await fetch(`${API_BASE_URL}/coffee`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getCoffeesWithFilters(filters: CoffeeFilterParams): Promise<CoffeeCardType[]> {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
  if (filters.roastLevel) params.append('roastLevel', filters.roastLevel);
  if (filters.origin) params.append('origin', filters.origin);

  const response = await fetch(`${API_BASE_URL}/coffee?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getCoffeeById(id: number): Promise<CoffeeCardType> {
  const response = await fetch(`${API_BASE_URL}/coffee/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createCoffee(coffee: Omit<CoffeeCardType, 'id'>): Promise<CoffeeCardType> {
  const response = await fetch(`${API_BASE_URL}/coffee/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coffee),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
