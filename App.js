import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, Alert } from 'react-native';
import { auth } from './services/auth';
import { styles } from './style/styles';
import HomeScren from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import TripScreen from './screens/TripScreen';
import EmergencyNumbersScreen from './screens/EmergencyNumbersScreen';
import DriverScreen from './screens/DriverScreen';
import LinkDeviceScreen from './screens/LinkDeviceScreen';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [ session, setSession ] = useState(null);
  const [ initializing, setInitializing ] = useState(true);

  useEffect(() => {
    // cargar sesión actual al inicio
    auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // establece una subscripción para recibir actualizaciones de autenticación 
    // en tiempo real
    const { data: listener } = auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);

        if (event === 'INITIAL_SESSION') {
          setInitializing(false);
        } else if (event === 'SIGNED_IN') {
          Alert.alert('¡Bienvenido!', 'Inicio de sesión exitoso');
        } else if (event === 'SIGNED_OUT') {
          Alert.alert('¡Hasta luego!', 'Sesión cerrada');
        }
      }
    );

    // anula la subscripción
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (initializing) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: 'tomato' }
        }}
      >
        {
          // verifica si no se ha iniciado sesión
          session ? ( 
            <>
             <Stack.Screen // carga las demás pantallas
                name='home' 
                component={HomeScren}
                options={{title: 'AxoMotor Driver'}}
                />
              <Stack.Screen 
                name='trip' 
                component={TripScreen}
                options={{title: 'Viaje'}}
                />
              <Stack.Screen 
                name='emergencyNumbers' 
                component={EmergencyNumbersScreen}
                options={{title: 'Números de emergencia'}}
                />
              <Stack.Screen 
                name='driver' 
                component={DriverScreen}
                options={{title: 'Conductor'}}
              />
            </>
          ) : (
            <Stack.Screen // carga únicamente la pantalla de inicio de sesión
              name='login' 
              component={LogInScreen}
              options={{title: 'Inicio de sesión'}}
            />
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
