import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { register, login } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../store/useAuth';

export default function OnboardingScreen({ navigation }: any) {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const setToken = useAuth((s) => s.setToken);

  const handleStart = async () => {
    try {
      // попытка логина, если нет — регистрация
      try {
        await login(email, password);
      } catch {
        await register(email, password);
      }
      const token = await SecureStore.getItemAsync('token');
      setToken(token || undefined);
      navigation.replace('Items');
    } catch (e: any) {
      Alert.alert('Ошибка', e?.message || 'Не удалось авторизоваться');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dressmaster</Text>
      <Text style={styles.subtitle}>Добавьте 5 вещей — получите 3 образа.</Text>
      <Input value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
      <Input value={password} onChangeText={setPassword} placeholder="Пароль" secureTextEntry style={{ marginTop: 8 }} />
      <Button title="Начать" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 16 }
});
