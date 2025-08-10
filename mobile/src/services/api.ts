import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_BASE_URL =
  (Constants.expoConfig?.extra as any)?.API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'http://localhost:3000';

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

export async function getItems() {
  const { data } = await api.get('/items');
  return data;
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
