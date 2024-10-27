import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SelectDonationTypeScreen from '../screens/SelectDonationTypeScreen';
import FinalizeDonationScreen from '../screens/FinalizeDonationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const ContributeStack = createStackNavigator();

const ContributeStackNavigator = () => (
  <ContributeStack.Navigator screenOptions={{ headerShown: false }}>
    <ContributeStack.Screen name="SelectDonationType" component={SelectDonationTypeScreen} />
    <ContributeStack.Screen name="FinalizeDonation" component={FinalizeDonationScreen} />
  </ContributeStack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: 'home-outline' | 'add-circle-outline' | 'person-outline' = 'home-outline';

          if (route.name === 'Início') {
            iconName = 'home-outline';
          } else if (route.name === 'Contribuir') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7e60bf',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Contribuir" component={ContributeStackNavigator} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;