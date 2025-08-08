import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import DeviceAPI from '../services/device';

export default function LinkDeviceScreen() {
  const [ deviceIp, setDeviceIp ] = useState('');
  const [ linkingStarted, setLinkStarted ] = useState(false);
  const [ deviceInfo, setDeviceInfo ] = useState(null); // { id, ip, status }
  const [ connectionStatus, setConnectionStatus ] = useState(''); // { id, ip, status }

  // Simulación de estados posibles: 'verificando', 'conectando', 'desconectado'
  // En la práctica, esto debería venir del backend o del propio DeviceAPI

  // Verifica si se especificó una dirección IPv4 válida.
  const isValidIp = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;
    return regex.test(ip);
  }

  // Maneja el proceso de enlazamiento
  const handleLink = async () => {
    setLinkStarted(true);

    if (isValidIp(deviceIp)) {
      try {
        // realiza el enlazamiento y obtiene la información del dispositivo
        await DeviceAPI.link(deviceIp);
        setDeviceInfo(DeviceAPI.getInfo());
        setConnectionStatus('connected');

        Alert.alert('Información', 'Dispositivo enlazado correctamente.');
      } catch (error) {
        Alert.alert('Error', 'Error al enlazar el dispositivo');
      }
    } else {
      Alert.alert('Error', 'Por favor ingresa una dirección IP válida.');
    }

    setLinkStarted(false);
  };

  // Función para obtener color de badge según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'checking':
        return '#FFD600';
      case 'connected':
        return '#007AFF';
      case 'disconnected':
        return '#FF3B30';
      default:
        return '#888';
    }
  };

  useEffect(() => {
    const testConnection = async () => {
      setConnectionStatus('checking');
      
      if (DeviceAPI.isLinked()) {
        setDeviceInfo(DeviceAPI.getInfo());

        try {
          await DeviceAPI.testConnection();
          setConnectionStatus('connected');
        } catch (error) {
          Alert.alert('Error', 'No se pudo conectar al dispositivo');
          setConnectionStatus('disconnected');
        }
      }
    };

    testConnection();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
      keyboardVerticalOffset={ Platform.OS === 'ios' ? 40 : 0 }
    >
      <ScrollView 
        contentContainerStyle={styles.container} 
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.instructionsBox}>
          <Text style={styles.title}>Instrucciones para vincular el dispositivo</Text>
          <Text style={styles.instructions}>
            Para poder iniciar un viaje, primero deberá conectar el dispositivo con la aplicación mediante un hotspot.
            {'\n'}
            {'\n'}1. Habilita el Hotspot en tu teléfono móvil:
            {'\n'}   - El nombre de la red (SSID) y la contraseña deben establecerse como "axomotor_v1".
            {'\n'}   - La banda de la red debe estar en 2.4GHz.
            {'\n'}2. Encienda el dispositivo y espere unos 30 segundos.
            {'\n'}3. Para obtener la dirección IP del dispositivo conectado (etiquetado como 'espressif'):
            {'\n'}   - En Android: Ve a los detalles de los dispositivos conectados en la configuración del Hotspot.
            {'\n'}   - En iOS: Ve a Configuración {'>'} Datos móviles {'>'} Compartir Internet y revisa los dispositivos conectados.
            {'\n'}4. Ingresa la dirección IP del dispositivo a continuación.
          </Text>
        </View>

        {deviceInfo && (
          <View style={styles.deviceInfoBox}>
            <Text style={styles.deviceInfoTitle}>Dispositivo enlazado</Text>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Identificador:</Text>
              <Text style={styles.deviceInfoValue}>{deviceInfo.id}</Text>
            </View>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Dirección IP:</Text>
              <Text style={styles.deviceInfoValue}>{deviceInfo.ipAddress}</Text>
            </View>
            <View style={styles.deviceInfoRow}>
              <Text style={styles.deviceInfoLabel}>Estado:</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(connectionStatus) }]}> 
                <Text style={styles.statusBadgeText}>{
                    connectionStatus === 'checking' ? 'Verificando' : 
                    (connectionStatus === 'connected' ? 'Conectado' : 
                    (connectionStatus === 'disconnected' ? 'Desconectado' : ''))
                  }</Text>
              </View>
            </View>
          </View>
        )}

        {!deviceInfo && (
          <>
            <Text style={styles.label}>Dirección IP del dispositivo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 192.168.4.1"
              keyboardType="numeric"
              value={deviceIp}
              onChangeText={setDeviceIp}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.button, linkingStarted && styles.buttonDisabled]}
              disabled={linkingStarted}
              onPress={handleLink}
            >
              {linkingStarted ? (
                <View style={styles.buttonWithIcon}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.buttonText}>Enlazando...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Enlazar</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  instructionsBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  instructions: {
    fontSize: 15,
    color: '#444',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
  },
  deviceInfoBox: {
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceInfoLabel: {
    fontWeight: 'bold',
    color: '#222',
    width: 110,
  },
  deviceInfoValue: {
    color: '#444',
    fontSize: 15,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  hotspotButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  hotspotButtonText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
