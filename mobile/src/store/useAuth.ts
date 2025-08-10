import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type State = { token?: string };
type Actions = {
  setToken: (t?: string) => void;
  logout: () => Promise<void>;
};

export const useAuth = create<State & Actions>((set) => ({
  token: undefined,
  setToken: (t) => set({ token: t }),
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ token: undefined });
  }
}));
