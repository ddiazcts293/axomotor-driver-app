import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../style/styles';
import { colors } from '../style/theme';
import { supabase } from '../services/supabase_client';

export default function LogInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Lógica de autenticación
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor ingresa tu correo y contraseña');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Correo o contraseña incorrectos');
    } else {
      alert('¡Inicio de sesión exitoso!');
      // 👉 Aquí puedes hacer la navegación, por ejemplo:
      // navigation.navigate('Home');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Image
        source={require('../assets/AxoMotor.png')}
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
        placeholderTextColor={colors.secondaryGray}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.secondaryGray}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}