import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

type Occasion = 'work' | 'date' | 'sport';

export interface ItemDto {
  id: string;
  category: 'top' | 'bottom' | 'shoes' | 'accessory';
  color?: string;
  season?: string;
  formality?: number;
  imageUrl?: string;
}

export interface OutfitItems {
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryIds?: string[];
}

export interface GeneratedOutfit {
  items: OutfitItems;
  score: number;
}

export interface SavedOutfit {
  id: string;
  userId?: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryIds: string[];
  occasion?: string | null;
  temperatureRange?: string | null;
  score?: number | null;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
const API_BASE_URL = (extra.API_BASE_URL as string) || 'http://localhost:3000';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function register(email: string, password: string) {
  const { data } = await api.post<{ token: string }>('/auth/register', { email, password });
  await SecureStore.setItemAsync('token', data.token);
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
  await SecureStore.setItemAsync('token', data.token);
}

export async function getItems() {
  const { data } = await api.get<ItemDto[]>('/items');
  return data;
}

export async function addItem(payload: Omit<ItemDto, 'id'>) {
  const { data } = await api.post<ItemDto>('/items', payload);
  return data;
}

export async function generateOutfits(occasion: Occasion, temp?: number) {
  const { data } = await api.post<GeneratedOutfit[]>('/outfits/generate', { occasion, temp });
  return data;
}

export async function saveOutfit(outfit: { items: OutfitItems; occasion?: string }) {
  const { data } = await api.post<SavedOutfit>('/outfits', outfit);
  return data;
}

export async function getCalendar(month?: string) {
  const { data } = await api.get<{ id: string; date: string; outfitId: string }[]>('/calendar', { params: { month } });
  return data;
}

export async function addCalendarEntry(date: string, outfitId: string) {
  const { data } = await api.post('/calendar', { date, outfitId });
  return data;
}
