import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { generateOutfits, saveOutfit, addCalendarEntry } from '../services/api';

export default function GenerateScreen({ navigation }: any) {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await generateOutfits('work', 15); // офис + 15°C
        setOutfits(results);
      } catch (e: any) {
        Alert.alert('Ошибка', e?.message || 'Не удалось сгенерировать');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveAndCalendar = async (outfit: any) => {
    try {
      const saved = await saveOutfit({
        items: outfit.items,
        occasion: 'work'
      });
      
      // Сохраняем на завтра
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      await addCalendarEntry(dateStr, saved.id);
      Alert.alert('Успех', 'Образ сохранён в календарь на завтра!');
      navigation.navigate('Calendar');
    } catch (e: any) {
      Alert.alert('Ошибка', 'Не удалось сохранить');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Ваши образы:</Text>
      
      {loading && <Text>Генерируем...</Text>}
      
      <FlatList
        data={outfits}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ 
            padding: 16, 
            borderWidth: 1, 
            borderColor: '#eee', 
            borderRadius: 8, 
            marginVertical: 8,
            backgroundColor: '#f8f9fa'
          }}>
            <Text>Верх: {item.items.topId}</Text>
            <Text>Низ: {item.items.bottomId}</Text>
            <Text>Обувь: {item.items.shoesId}</Text>
            <Text>Оценка: ★ {item.score}/15</Text>
            <Button 
              title="Сохранить на завтра" 
              onPress={() => saveAndCalendar(item)}
              disabled={loading}
            />
          </View>
        )}
      />
    </View>
  );
}