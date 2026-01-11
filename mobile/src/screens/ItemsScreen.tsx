import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { getItems } from '../services/api';

export default function ItemsScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to load items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('Outfit', { id: item.id })}>
      <Card>
        <View style={styles.itemContainer}>
          <Image 
            source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400' }} 
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name || 'Unnamed Item'}</Text>
            <Text style={styles.itemType}>{item.type || 'Unknown Type'}</Text>
            <Text style={styles.itemColor}>Цвет: {item.color || 'N/A'}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Загрузка...' : 'Нет вещей. Добавьте первую вещь!'}
          </Text>
        }
      />
      <Button title="Добавить вещь" onPress={() => navigation.navigate('AddItem')} />
      <Button title="Сгенерировать образы" onPress={() => navigation.navigate('Generate')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  itemImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 8, 
    marginRight: 12 
  },
  itemInfo: { 
    flex: 1 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  itemType: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 2 
  },
  itemColor: { 
    fontSize: 14, 
    color: '#888' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 32, 
    fontSize: 16, 
    color: '#999' 
  }
});