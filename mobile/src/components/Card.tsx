import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

export default function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }
});
