import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor="#888" />;
}
const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 }
});
