import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const driverData = {
  name: 'Juan Pérez',
  avatarUrl: 'https://i.pravatar.cc/150?u=juan', // reemplazar con avatar real
  registeredAt: '2024-09-15',
};

const DriverScreen = () => {
  const handleChangePassword = () => {
    // Navegar o abrir modal de cambio de contraseña
  };

  const handleChangeEmail = () => {
    // Navegar o abrir modal de cambio de email
  };

  const handleChangePhone = () => {
    // Navegar o abrir modal de cambio de número
  };

  const handleLogout = () => {
    // Cerrar sesión y redirigir
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: driverData.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{driverData.name}</Text>
        <Text style={styles.registered}>
          Registro: {new Date(driverData.registeredAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <SettingsButton label="Cambiar contraseña" onPress={handleChangePassword} />
        <SettingsButton label="Cambiar correo electrónico" onPress={handleChangeEmail} />
        <SettingsButton label="Cambiar número de teléfono" onPress={handleChangePhone} />
        <SettingsButton label="Salir" onPress={handleLogout} highlight />
      </View>
    </ScrollView>
  );
};

const SettingsButton = ({ label, onPress, highlight = false }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, highlight && styles.logoutButton]}
  >
    <Text style={[styles.buttonText, highlight && styles.logoutText]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold' },
  registered: { color: '#666', marginTop: 4 },
  actions: { padding: 16 },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutText: {
    color: '#fff',
  },
});

export default DriverScreen;