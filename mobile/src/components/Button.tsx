import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = { title: string; onPress: () => void; variant?: 'primary' | 'secondary' };

export default function Button({ title, onPress, variant = 'primary' }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, variant === 'secondary' && styles.secondary]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#222', padding: 14, borderRadius: 10, alignItems: 'center', marginVertical: 6 },
  secondary: { backgroundColor: '#666' },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
