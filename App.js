import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStatistics } from './src/services/storageService';

import HomeScreen from './src/screens/HomeScreen';
import GameModeScreen from './src/screens/GameModeScreen';
import GameScreen from './src/screens/GameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HighScoresScreen from './src/screens/HighScoresScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      loadStats();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const stats = await getStatistics();
    setStats(stats);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 2,
            },
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerTintColor: '#6366f1',
            headerBackTitleVisible: true,
          }}
        >
          <Stack.Screen
            name="Home"
            options={{
              headerTitle: 'Calculo Mental',
              headerBackVisible: false,
            }}
            component={() => <HomeScreen stats={stats} />}
          />
          <Stack.Screen
            name="GameMode"
            component={GameModeScreen}
            options={{
              headerTitle: 'Selecciona un Modo',
            }}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              headerTitle: 'Jugando',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              headerTitle: 'Resultados',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="HighScores"
            component={HighScoresScreen}
            options={{
              headerTitle: 'Mejores Puntajes',
            }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{
              headerTitle: 'Estadisticas',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
