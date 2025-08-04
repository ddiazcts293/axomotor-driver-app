import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { supabase } from './supabase_client';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SplashScreen from './components/SplashScreen';
import ReportIncidentScreen from './screens/ReportIncidentScreen';
import IncidentsScreen from './screens/IncidentsScreen';
import IncidentGalleryScreen from './screens/IncidentGalleryScreen';
import TripScreen from './screens/TripScreen';
import DriverScreen from './screens/DriverScreen';

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
              options={{ title: 'Panel Principal' }}
            />
            <Stack.Screen
              name="ReportIncident"
              component={ReportIncidentScreen}
              options={{ title: 'Registrar Incidente' }}
            />
            <Stack.Screen
              name="Incidents"
              component={IncidentsScreen}
              options={{ title: 'Incidencias Reportadas' }}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{ title: 'Restablecer Contraseña' }}
            />
            <Stack.Screen
              name="IncidentGallery"
              component={IncidentGalleryScreen}
              options={{ title: 'Galería de Incidentes' }}
            />
            <Stack.Screen
              name="Viaje"
              component={TripScreen} 
              options={{ title: 'Viaje' }}
              />
            <Stack.Screen
              name="Driver"
              component={DriverScreen} //
              options={{ title: 'Ajustes de Conductor' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
              options={{ title: 'Restablecer Contraseña' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}