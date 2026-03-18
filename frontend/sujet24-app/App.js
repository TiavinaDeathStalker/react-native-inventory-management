import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddMaterielScreen from './screens/AddMaterielScreen';
import EditMaterielScreen from './screens/EditMaterielScreen';
import StatsScreen from './screens/StatsScreen';

const Stack = createStackNavigator();

// Composant titre du header avec icone centré
const HeaderTitle = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
    <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />
    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#6a1b9a' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <HeaderTitle icon="cube" label="Gestion Materiels" />
          }}
        />
        <Stack.Screen
          name="AddMateriel"
          component={AddMaterielScreen}
          options={{
            headerTitle: () => <HeaderTitle icon="add-circle" label="Ajouter un Materiel" />
          }}
        />
        <Stack.Screen
          name="EditMateriel"
          component={EditMaterielScreen}
          options={{
            headerTitle: () => <HeaderTitle icon="create" label="Modifier un Materiel" />
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            headerTitle: () => <HeaderTitle icon="bar-chart" label="Statistiques" />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}