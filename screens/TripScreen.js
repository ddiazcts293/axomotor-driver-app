import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

const TravelInfoCard = ({ title, location, address, time }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text>{location}</Text>
    <Text>{address}</Text>
    <Text style={styles.time}>{time}</Text>
  </View>
);

const StopItem = ({ title, time, status, duration }) => {
  const statusColors = {
    camino: '#007bff',
    completado: '#28a745',
    omitido: '#ffc107',
  };

  return (
    <View style={styles.stopItem}>
      <View
        style={[styles.statusDot, { backgroundColor: statusColors[status] || '#ccc' }]}
      />
      <View style={styles.stopInfo}>
        <Text style={styles.stopTitle}>{title}</Text>
        <Text>{time}</Text>
      </View>
      <Text style={styles.duration}>{duration}</Text>
    </View>
  );
};

const AnimatedTripButton = ({ status, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.95,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  const animatedStyle = {
    transform: [{ scale }],
  };

  const getLabel = () => {
    if (status === 'activo') return 'Pausar viaje';
    if (status === 'pausado') return 'Reanudar viaje';
    return 'Iniciar viaje';
  };

  return (
    <Animated.View style={[styles.tripButton, animatedStyle]}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.buttonText}>{getLabel()}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TripScreen = () => {
  const tripStatus = 'activo';

  const stops = [
    {
      title: 'Gasolinera El Rayo',
      time: '09:10 AM',
      status: 'completado',
      duration: '15 min',
    },
    {
      title: 'Estación Café',
      time: '09:45 AM',
      status: 'camino',
      duration: '10 min',
    },
    {
      title: 'Centro Logístico',
      time: '10:15 AM',
      status: 'omitido',
      duration: '20 min',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.placeholderMap}>
        <Text style={styles.placeholderText}>
          Aquí irá el mapa cuando la app esté en producción
        </Text>
      </View>

      <TravelInfoCard
        title="Origen"
        location="Oficinas"
        address="Calle 123"
        time="08:00 AM"
      />
      <TravelInfoCard
        title="Destino"
        location="Planta Central"
        address="Avenida 456"
        time="10:30 AM"
      />

      <AnimatedTripButton
        status={tripStatus}
        onPress={() => {
          // Lógica para iniciar/detener/pausar viaje
        }}
      />

      <View style={styles.stopsSection}>
        {stops.map((stop, index) => (
          <StopItem
            key={index}
            title={stop.title}
            time={stop.time}
            status={stop.status}
            duration={stop.duration}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  placeholderMap: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: { color: '#555', fontStyle: 'italic' },
  card: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  time: { marginTop: 4, color: '#555' },
  tripButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    padding: 14,
    fontWeight: 'bold',
  },
  stopsSection: { marginTop: 10, marginHorizontal: 16 },
  stopItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  stopInfo: { flex: 1 },
  stopTitle: { fontWeight: '600' },
  duration: { fontStyle: 'italic', color: '#555' },
});

export default TripScreen;