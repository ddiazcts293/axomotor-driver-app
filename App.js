import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { supabase } from './services/supabase_client';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import SplashScreen from './components/SplashScreen';
import ReportIncidentScreen from './screens/ReportIncidentScreen';
import IncidentsScreen from './screens/IncidentsScreen';
import IncidentGalleryScreen from './screens/IncidentGalleryScreen';
import TripScreen from './screens/TripScreen';
import DriverScreen from './screens/DriverScreen';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import './backgroundLocation';
import { LOCATION_TASK_NAME } from './backgroundLocation';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['axomotor_reset://'],
  config: {
    screens: {
      Login: 'login',
      Home: 'home',
      ResetPasswordScreen: {
        path: 'reset-password',
        parse: {
          token: (token) => `${token}`,
        },
      },
    },
  },
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Primer useEffect para manejo de sesión y deep link
  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const { queryParams } = Linking.parse(url);
        const accessToken = queryParams?.access_token;
        const refreshToken = queryParams?.refresh_token;

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            setSession(data.session);
          }
        }
      }
    };

    const getSession = async () => {
      await handleDeepLink();
      const { data } = await supabase.auth.getSession();
      setSession(data?.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Segundo useEffect para iniciar ubicación en segundo plano
  useEffect(() => {
    const startBackgroundLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (status !== 'granted' || bgStatus !== 'granted') {
        console.error('❌ Permisos de ubicación denegados');
        return;
      }

      const isRegistered = await TaskManager.isTaskRegisteredAsync('background-location-task');
      if (!isRegistered) {
        await Location.startLocationUpdatesAsync('background-location-task', {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 10000, // cada 10 segundos
          distanceInterval: 0,
          showsBackgroundLocationIndicator: false,
          foregroundService: {
            notificationTitle: 'Rastreo activo',
            notificationBody: 'Enviando ubicación en segundo plano...',
          },
        });
      }
    };

    startBackgroundLocation();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {session ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'Panel principal',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Driver')} style={{ marginRight: 16 }}>
                    <FontAwesome name="cog" size={24} color="#fff" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="ReportIncident"
              component={ReportIncidentScreen}
              options={{ title: 'Reportar incidencia' }}
            />
            <Stack.Screen
              name="Incidents"
              component={IncidentsScreen}
              options={{ title: 'Incidencias' }}
            />
            <Stack.Screen
              name="IncidentGallery"
              component={IncidentGalleryScreen}
              options={{ title: 'Galería de incidentes' }}
            />
            <Stack.Screen
              name="Viaje"
              component={TripScreen}
              options={{ title: 'Viajes' }}
            />
            <Stack.Screen
              name="Driver"
              component={DriverScreen}
              options={{ title: 'Conductor' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LogInScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
