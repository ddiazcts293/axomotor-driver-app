import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { auth } from '../services/supabase';
import { globalStyles } from '../style/styles';
import { colors } from '../style/theme';

export default function LogInScreen() {
  // declara las variables y los métodos para establecerlas
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  // función que maneja cuando se debe iniciar sesión
  const handleLogIn = async () => {
    if (!email || !password) {
      alert('Por favor ingresa tu correo y contraseña');
      return;
    }

    const { data, error } = await auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Fallo al iniciar sesión', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Image
        source={require('../assets/banner-horizontal.png')}
        style={{
          width: 200,
          height: 200,
          alignSelf: 'center',
          marginBottom: 20,
            marginTop: 70,
          resizeMode: 'contain',
        }}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={ colors.secondaryGray }
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Contraseña"
        placeholderTextColor={ colors.secondaryGray }
        autoCapitalize='none'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleLogIn}>
        <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
