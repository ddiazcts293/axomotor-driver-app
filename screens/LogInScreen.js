import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../style/styles';
import { colors } from '../style/theme';
import { supabase } from '../supabaseClient';

export default function LoginScreen() {
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

  // Recuperar contraseña
  const handleForgotPassword = async () => {
    if (!email) {
      alert('Ingresa tu correo para restablecer la contraseña');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert('Hubo un problema al enviar el correo');
    } else {
      alert('Te enviamos el correo para restablecer tu contraseña');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Image
        source={require('../assets/AxoMotor_horizontal.png')}
        style={{
          width: 120,
          height: 120,
          alignSelf: 'center',
          marginBottom: 20,
            marginTop: 30,
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
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={globalStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
}