import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import ItemsScreen from '../screens/ItemsScreen';
import AddItemScreen from '../screens/AddItemScreen';
import GenerateScreen from '../screens/GenerateScreen';
import OutfitScreen from '../screens/OutfitScreen';
import CalendarScreen from '../screens/CalendarScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Items: undefined;
  AddItem: undefined;
  Generate: undefined;
  Outfit: { id: string } | undefined;
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: 'Dressmaster' }} />
      <Stack.Screen name="Items" component={ItemsScreen} options={{ title: 'Мой гардероб' }} />
      <Stack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Добавить вещь' }} />
      <Stack.Screen name="Generate" component={GenerateScreen} options={{ title: 'Образы' }} />
      <Stack.Screen name="Outfit" component={OutfitScreen} options={{ title: 'Образ' }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Календарь' }} />
    </Stack.Navigator>
  );
}
