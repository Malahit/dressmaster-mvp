import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { getItems, ItemDto } from '../services/api';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

export default function ItemsScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Гардероб</Text>
        <Button title="Добавить" onPress={() => navigation.navigate('AddItem')} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontWeight: '600' }}>{item.category}</Text>
            {item.color && <Text>Цвет: {item.color}</Text>}
            {item.formality && <Text>Формальность: {item.formality}/5</Text>}
            {item.season && <Text>Сезон: {item.season}</Text>}
          </Card>
        )}
        ListEmptyComponent={!loading ? <Text>Добавьте вещи, чтобы генерировать образы.</Text> : null}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <Button title="Сгенерировать образы" onPress={() => navigation.navigate('Generate')} style={{ marginTop: 12 }} />
    </View>
  );
}
