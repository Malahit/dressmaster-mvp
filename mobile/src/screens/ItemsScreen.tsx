import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { getItems, getItemsFiltered, deleteItem, getWardrobeSummary } from '../services/api';

export default function ItemsScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [itemsData, summaryData] = await Promise.all([
        activeFilter ? getItemsFiltered({ category: activeFilter }) : getItems(),
        getWardrobeSummary()
      ]);
      setItems(itemsData);
      setSummary(summaryData);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(id);
              load();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          }
        }
      ]
    );
  }

  function handleEdit(item: any) {
    // Navigate to edit screen if it exists
    // For now, we'll just show an alert
    Alert.alert('Edit Item', `Edit functionality for ${item.category} (ID: ${item.id})`);
  }

  function applyFilter(category: string | null) {
    setActiveFilter(category);
  }

  useEffect(() => {
    load();
  }, [activeFilter]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const renderItem = ({ item }: any) => (
    <Card>
      <View style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
          {item.color && <Text style={styles.itemDetail}>Color: {item.color}</Text>}
          {item.season && <Text style={styles.itemDetail}>Season: {item.season}</Text>}
          {item.formality && <Text style={styles.itemDetail}>Formality: {item.formality}/5</Text>}
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {summary && (
        <Card>
          <Text style={styles.summaryTitle}>Wardrobe Summary</Text>
          <Text style={styles.summaryText}>Total Items: {summary.totalItems}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tops: {summary.byCategory.top}</Text>
            <Text style={styles.summaryText}>Bottoms: {summary.byCategory.bottom}</Text>
            <Text style={styles.summaryText}>Shoes: {summary.byCategory.shoes}</Text>
            <Text style={styles.summaryText}>Accessories: {summary.byCategory.accessory}</Text>
          </View>
          <Text style={styles.summaryText}>
            Diversity: {summary.diversity.categories} categories, {summary.diversity.seasons} seasons, {summary.diversity.colors} colors
          </Text>
        </Card>
      )}

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Category:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterBtn, !activeFilter && styles.filterBtnActive]}
            onPress={() => applyFilter(null)}
          >
            <Text style={styles.filterBtnText}>All</Text>
          </TouchableOpacity>
          {['top', 'bottom', 'shoes', 'accessory'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, activeFilter === cat && styles.filterBtnActive]}
              onPress={() => applyFilter(cat)}
            >
              <Text style={styles.filterBtnText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in your wardrobe yet</Text>
          </View>
        }
      />

      <Button title="Add Item" onPress={() => navigation.navigate('AddItem')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#666', marginVertical: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  filterContainer: { marginVertical: 12 },
  filterTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  filterButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8
  },
  filterBtnActive: { backgroundColor: '#222' },
  filterBtnText: { fontSize: 12, color: '#fff' },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1 },
  itemCategory: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemDetail: { fontSize: 14, color: '#666', marginVertical: 1 },
  itemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8 },
  actionText: { fontSize: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#999' }
});
