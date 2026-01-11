import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const extra: any = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(email: string, password: string) {
  const { data } = await api.post('/auth/register', { email, password });
  await SecureStore.setItemAsync('token', data.token);
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('token', data.token);
}

// Mock images for different clothing types
const mockImages: Record<string, string[]> = {
  top: [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'
  ],
  bottom: [
    'https://images.unsplash.com/photo-1542272454315-7fbfabf87084?w=400',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
  ],
  default: [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    'https://images.unsplash.com/photo-1558769132-cb1aea3c3e75?w=400'
  ]
};

function addMockImageIfNeeded(item: any): any {
  if (!item.imageUrl) {
    const type = item.type?.toLowerCase() || 'default';
    const images = mockImages[type] || mockImages.default;
    const randomIndex = Math.floor(Math.random() * images.length);
    item.imageUrl = images[randomIndex];
  }
  return item;
}

export async function getItems() {
  const { data } = await api.get('/items');
  // Add mock images to items that don't have images
  return Array.isArray(data) ? data.map(addMockImageIfNeeded) : data;
}

export async function addItem(payload: any) {
  const { data } = await api.post('/items', payload);
  return data;
}

export async function generateOutfits(occasion: 'work' | 'date' | 'sport', temp?: number) {
  const { data } = await api.post('/outfits/generate', { occasion, temp });
  return data;
}

export async function saveOutfit(outfit: any) {
  const { data } = await api.post('/outfits', outfit);
  return data;
}

export async function getCalendar(month?: string) {
  const { data } = await api.get('/calendar', { params: { month } });
  return data;
}

export async function addCalendarEntry(date: string, outfitId: string) {
  const { data } = await api.post('/calendar', { date, outfitId });
  return data;
}
