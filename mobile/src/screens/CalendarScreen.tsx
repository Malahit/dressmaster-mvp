import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getCalendar } from '../services/api';
import Card from '../components/Card';

export default function CalendarScreen({ navigation }: any) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const data = await getCalendar();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load calendar:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const renderEntry = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('Outfit', { id: item.outfitId })}>
      <Card>
        <View style={styles.entryContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateDay}>
              {new Date(item.date).getDate()}
            </Text>
            <Text style={styles.dateMonth}>
              {new Date(item.date).toLocaleDateString('ru-RU', { month: 'short' })}
            </Text>
          </View>
          <View style={styles.outfitInfo}>
            <Text style={styles.outfitTitle}>Образ на день</Text>
            {item.outfit && (
              <Text style={styles.outfitDetails}>
                {item.outfit.occasion || 'Повседневный'}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Календарь образов</Text>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Календарь пуст. Сгенерируйте образы и добавьте их в календарь!
          </Text>
        }
      />
    </View>
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
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 16, 
    color: '#333' 
  },
  entryContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  dateContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  dateDay: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#fff' 
  },
  dateMonth: { 
    fontSize: 12, 
    color: '#fff', 
    textTransform: 'uppercase' 
  },
  outfitInfo: { 
    flex: 1 
  },
  outfitTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4, 
    color: '#333' 
  },
  outfitDetails: { 
    fontSize: 14, 
    color: '#666' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 32, 
    fontSize: 16, 
    color: '#999' 
  }
});
