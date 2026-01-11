import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import Card from '../components/Card';

export default function OutfitScreen({ route }: any) {
  const { id } = route.params || {};
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error('Failed to load item:', error);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Вещь не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Image 
          source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600' }} 
          style={styles.image}
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.name || 'Unnamed Item'}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Тип:</Text>
            <Text style={styles.value}>{item.type || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Цвет:</Text>
            <Text style={styles.value}>{item.color || 'N/A'}</Text>
          </View>
          
          {item.season && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Сезон:</Text>
              <Text style={styles.value}>{item.season}</Text>
            </View>
          )}
          
          {item.occasion && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Для:</Text>
              <Text style={styles.value}>{item.occasion}</Text>
            </View>
          )}
          
          {item.createdAt && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Добавлено:</Text>
              <Text style={styles.value}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  image: { 
    width: '100%', 
    height: 300, 
    borderRadius: 12, 
    marginBottom: 16 
  },
  detailsContainer: { 
    paddingTop: 8 
  },
  name: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 16, 
    color: '#333' 
  },
  detailRow: { 
    flexDirection: 'row', 
    marginBottom: 12, 
    alignItems: 'center' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#666', 
    width: 100 
  },
  value: { 
    fontSize: 16, 
    color: '#333', 
    flex: 1 
  },
  errorText: { 
    fontSize: 18, 
    color: '#999' 
  }
});
