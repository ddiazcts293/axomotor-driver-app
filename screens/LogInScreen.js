import React, { useState } from "react";
import { View, Text, TextInput, Image, StatusBar, Alert, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../services/auth'
import { styles } from "../style/styles";

export default function LogInScreen() {
  // obtiene el hook de navegación
  const navigation = useNavigation();
  // declara las variables y los métodos para establecerlas
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  // función que maneja cuando se debe iniciar sesión
  const handleLogIn = async () => {
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.navigate('home', { user: data.user });
    }
  };

  return (
    <KeyboardAvoidingView>
      <StatusBar backgroundColor="#0284C7" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Iniciar sesión</Text>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source= { require('../assets/banner-horizontal.svg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>Bienvenido a AxoMotor</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="user@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="password"
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogIn}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/user.png' }}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
