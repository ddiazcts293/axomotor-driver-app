import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import SplashScreen from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import ReportIncidentScreen from './screens/ReportIncidentScreen';
import IncidentsScreen from './screens/IncidentsScreen';
import IncidentGalleryScreen from './screens/IncidentGalleryScreen';
import TripScreen from './screens/TripScreen';
import DriverScreen from './screens/DriverScreen';

import { auth } from './services/supabase';

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import './backgroundLocation';
import { LOCATION_TASK_NAME } from './backgroundLocation';



/*
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
*/

export default function App() {
  const Stack = createNativeStackNavigator();
  const [ session, setSession ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  /*
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

  */

  // manejo de sesión
  useEffect(() => {
    // cargar sesión actual al inicio
    auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // establece una subscripción para recibir actualizaciones de autenticación 
    // en tiempo real
    const { data: listener } = auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);

        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        } else if (event === 'SIGNED_IN') {
          //Alert.alert('¡Bienvenido!', 'Inicio de sesión exitoso');
        } else if (event === 'SIGNED_OUT') {
          Alert.alert('¡Hasta luego!', 'Sesión cerrada');
        }
      }
    );

    // anula la subscripción
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  // verifica si la app está cargando
  if (loading) {
    return <SplashScreen />;
  }

  return (
    //<NavigationContainer linking={linking}>
    <NavigationContainer>
      <Stack.Navigator>
        {
          // verifica si se ha iniciado sesión
          session ? (
            // carga una colección de pantallas
            <>
              <Stack.Screen
                name="home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  title: 'AxoMotor Driver',
                  headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('driver')} style={{ marginRight: 16 }}>
                      <FontAwesome name="cog" size={24} color="#fff" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="report_incident"
                component={ReportIncidentScreen}
                options={{ title: 'Reportar incidencia' }}
              />
              <Stack.Screen
                name="incidents"
                component={IncidentsScreen}
                options={{ title: 'Incidencias' }}
              />
              <Stack.Screen
                name="incident_gallery"
                component={IncidentGalleryScreen}
                options={{ title: 'Galería de incidencias' }}
              />
              <Stack.Screen
                name="trip"
                component={TripScreen}
                options={{ title: 'Viaje' }}
              />
              <Stack.Screen
                name="driver"
                component={DriverScreen}
                options={{ title: 'Conductor' }}
              />
            </>
          ) : (
            // carga únicamente la pantalla de inicio de sesión
            <Stack.Screen
              name="login"
              component={LogInScreen}
              options={{ title: 'Iniciar sesión', headerShown: false }}
            />
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
