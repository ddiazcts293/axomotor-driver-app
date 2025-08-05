import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, TextInput, Alert, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../services/supabase_client';
import { useNavigation } from '@react-navigation/native';

const DriverScreen = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?u=juan');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    registeredAt: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeEmail = () => {
    setModalType('email');
    setInputValue(userData.email);
    setModalVisible(true);
  };

  const handleChangePassword = () => {
    setModalType('password');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    if (modalType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        Alert.alert('Error', 'Introduce un correo electrónico válido.');
        return;
      }
      const { error } = await supabase.auth.updateUser({ email: inputValue });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setUserData((prev) => ({ ...prev, email: inputValue }));
        Alert.alert('Éxito', 'Correo actualizado. Revisa tu bandeja para confirmar el cambio.');
      }
    } else if (modalType === 'password') {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Completa todos los campos.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Éxito', 'Contraseña actualizada.');
      }
    }

    setModalVisible(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        console.error('No se pudo obtener la sesión:', error?.message);
        return;
      }

      const userId = session.user.id;
      const email = session.user.email;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('name, created_at')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error al obtener perfil:', profileError.message);
        return;
      }

      setUserData({
        name: data.name,
        email,
        registeredAt: data.created_at,
      });
    };

    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Se requiere permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const selectedUri = result.assets[0].uri;
      setAvatarUrl(selectedUri);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
      return;
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              onError={(e) => console.log('Error al cargar imagen:', e.nativeEvent.error)}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>Correo: {userData.email}</Text>
          <Text style={styles.registered}>
            Registro: {new Date(userData.registeredAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.actions}>
          <SettingsButton label="Cambiar correo" icon="envelope" onPress={handleChangeEmail} />
          <SettingsButton label="Cambiar contraseña" icon="lock" onPress={handleChangePassword} />
          <SettingsButton label="Cerrar sesión" icon="sign-out" onPress={handleLogout} gray />
        </View>
      </ScrollView>

      <InputModal
        visible={modalVisible}
        title={modalType === 'email' ? 'Cambiar correo' : 'Cambiar contraseña'}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        modalType={modalType}
        inputValue={inputValue}
        setInputValue={setInputValue}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </>
  );
};

const InputModal = ({
  visible, title, onCancel, onSubmit, modalType,
  inputValue, setInputValue, currentPassword,
  newPassword, confirmPassword, setCurrentPassword,
  setNewPassword, setConfirmPassword
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <View style={{
          backgroundColor: '#fff', padding: 24, borderRadius: 10, width: '80%'
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{title}</Text>

          {modalType === 'password' ? (
            <>
              <TextInput
                placeholder="Contraseña actual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
            </>
          ) : (
            <TextInput
              placeholder="Nuevo correo electrónico"
              value={inputValue}
              onChangeText={setInputValue}
              autoCapitalize="none"
              style={styles.input}
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onCancel} style={{ marginRight: 16 }}>
              <Text style={{ color: '#007bff' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit}>
              <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  </Modal>
);

const SettingsButton = ({ label, onPress, icon, gray = false }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, gray && styles.grayButton]}
  >
    <View style={styles.buttonContent}>
      <FontAwesome
        name={icon}
        size={20}
        color={gray ? '#333' : '#fff'}
        style={{ marginRight: 10 }}
      />
      <Text style={[styles.buttonText, gray && styles.grayText]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7EFDF' },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: '#ccc',
  },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#555', marginBottom: 4 },
  registered: { fontSize: 14, color: '#999' },
  actions: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#0091EA',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  grayButton: { backgroundColor: '#f0f0f0' },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  grayText: { color: '#333' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
});

export default DriverScreen;
