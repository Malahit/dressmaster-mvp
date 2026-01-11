import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { addItem } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

export default function AddItemScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [color, setColor] = useState('');
  const [imageUri, setImageUri] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !type || !color) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      // Use mock Unsplash image if no image picked
      const finalImageUrl = imageUri || `https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&sig=${Date.now()}`;
      
      await addItem({
        name,
        type,
        color,
        imageUrl: finalImageUrl
      });
      
      Alert.alert('Успех', 'Вещь добавлена!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Ошибка', e?.message || 'Не удалось добавить вещь');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Название</Text>
      <Input 
        value={name} 
        onChangeText={setName} 
        placeholder="Например: Синяя рубашка" 
      />
      
      <Text style={styles.label}>Тип (верх/низ/обувь)</Text>
      <Input 
        value={type} 
        onChangeText={setType} 
        placeholder="Например: верх" 
      />
      
      <Text style={styles.label}>Цвет</Text>
      <Input 
        value={color} 
        onChangeText={setColor} 
        placeholder="Например: синий" 
      />

      <Text style={styles.label}>Фото</Text>
      <Button title="Выбрать фото" onPress={pickImage} />
      
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <Text style={styles.hint}>Или будет использовано изображение по умолчанию</Text>
      )}

      <View style={{ marginTop: 24 }}>
        <Button title="Сохранить" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 16, 
    marginBottom: 8 
  },
  preview: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    marginTop: 12 
  },
  hint: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 8, 
    fontStyle: 'italic' 
  }
});
