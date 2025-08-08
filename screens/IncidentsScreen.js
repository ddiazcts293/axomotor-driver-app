import React, { useEffect, useState } from 'react';
import AxoMotorAPI from '../services/axomotor';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { colors } from '../style/theme';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);

const priorityColors = {
  high: 'red',
  medium: 'yellow',
  cerrado: 'green',
  low: 'gray',
};

const statusLabels = {
  open: 'Abierto',
  inRevision: 'En revisión',
  closed: 'Cerrado',
  discarded: 'Descartado',
};

const incidentCodeLabels = {
  roadBlocked: 'Ruta bloqueada',
  engineFailure: 'Falla en el motor',
  flatTire: 'Llanta ponchada',
  brakeIssues: 'Problemas de frenos',
  overheating: 'Sobrecalentamiento',
  batteryFailure: 'Falla de batería',
  oilLeak: 'Fuga de aceite',
  fuelLeak: 'Fuga de combustible',
  steeringFailure: 'Falla de dirección',
  transmissionIssue: 'Problema de transmisión',
  accident: 'Accidente',
  trafficJam: 'Congestión de tráfico',
  routeDeviation: 'Desviación de ruta',
  gpsSignalLost: 'Señal GPS perdida',
  unauthorizedStop: 'Parada no autorizada',
  delayedDelivery: 'Entrega retrasada',
  wrongDelivery: 'Entrega incorrecta',
  loadShifted: 'Carga desplazada',
  packageDamaged: 'Paquete dañado',
  driverReportedSickness: 'Conductor reportó enfermedad',
  driverError: 'Error del conductor',
  driverViolation: 'Infracción del conductor',
  driverUnavailable: 'Conductor no disponible',
  fatigueReported: 'Fatiga reportada',
  inusualBehavior: 'Comportamiento inusual',
  theftAttempt: 'Intento de robo',
  cargoTheft: 'Robo de carga',
  vehicleStolen: 'Vehículo robado',
  tamperingDetected: 'Manipulación detectada',
  panicButtonActivated: 'Botón de pánico activado',
  unknownIssue: 'Problema desconocido',
  weatherDelay: 'Retraso por clima',
  customsDelay: 'Retraso en aduanas',
  fuelShortage: 'Escasez de combustible',
  checkpointIssue: 'Problema en el punto de control',
  deviceFailure: 'Falla de dispositivo',
  abnormalActivity: 'Actividad anormal',
};

const incidentTypeLabels = {
  mechanical: 'Mecánica',
  route: 'Ruta',
  cargo: 'Carga',
  driver: 'Conductor',
  security: 'Seguridad',
  other: 'Otro',
};


export default function IncidentsScreen() {
    const navigation = useNavigation();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchIncidents = async () => {
        try {
          const data = await AxoMotorAPI.listIncidents();
          setIncidents(data.items || []); // extrae los elementos reales
        } catch (err) {
          console.error('Error al cargar las incidencias:', err);
          setError('Hubo un problema al cargar las incidencias.');
        } finally {
          setLoading(false);
        }
      };

      fetchIncidents();
    }, []);



    
    const renderItem = ({ item }) => (
    
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.statusDot(item.priority)} />
        <Text style={styles.title}>
          {incidentCodeLabels[item.code] || item.code}
        </Text>

        <Text style={styles.timeText}>{dayjs(item.registrationDate).fromNow()}</Text>
      </View>
      <View style={styles.badgeRow}>
        <Text style={styles.badgeLeft}>{incidentTypeLabels[item.type] || item.type}</Text>
        <Text style={styles.badgeRight}>{statusLabels[item.status] || item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>Cargando incidencias...</Text>}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>}

      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item) => item.incidentId}
        contentContainerStyle={{ paddingVertical: 20 }}
      />

      {/* Botón para crear nueva incidencia */}
        <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('report_incident')}
        >
        <FontAwesome name="plus" size={18} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 10, fontWeight: 'bold' }}>
            Nueva incidencia
        </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7EFDF',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  badge: {
    backgroundColor: colors.primaryBlue,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  badgeLeft: {
    backgroundColor: colors.primaryBlue,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    maxWidth: '70%',
  },
  badgeRight: {
    backgroundColor: colors.primaryBlue,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    maxWidth: '30%',
  },
  statusDot: (status) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: priorityColors[status],
  }),
  newButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 3,
  },
});
