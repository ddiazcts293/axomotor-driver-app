import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, } from 'react-native';
import AxoMotorAPI from '../services/axomotor';
import SplashScreen from '../components/SplashScreen';

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
  const [tripStatus, setTripStatus] = useState('inactivo');
  const [tripLoading, setTripLoading ] = useState(true);
  const [trip, setTrip ] = useState(null);

  const toggleTripStatus = () => {
    if (tripStatus === 'inactivo') setTripStatus('activo');
    else if (tripStatus === 'activo') setTripStatus('pausado');
    else if (tripStatus === 'pausado') setTripStatus('activo');
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const user = await AxoMotorAPI.getMe();
        const trip = await AxoMotorAPI.getCurrentTrip(user.id);
        
        if (trip) {
          setTripLoading(false);
          setTrip(trip);
          console.log('Viaje actual cargado:', trip.tripId);
        } else {
          setTripLoading(true);
          console.warn('No se encontró viaje actual');
        }
      } catch (err) {
        console.error('Error al obtener viaje actual:', err);
      }
    };

    fetchTrip();
  }, []);

  // verifica si la app está cargando
  if (tripLoading) {
    return <SplashScreen />;
  }

  return (
    <ScrollView style={styles.container}>
      {
        trip ? (
          <>
          {/* Origen y destino en fila */}
          <View style={styles.headerRow}>
            <TravelInfoCard
              title="Origen"
              location={trip.origin.name}
              address={trip.origin.address}
              time={trip.origin.dateTime}
            />
            <TravelInfoCard
              title="Destino"
              location={trip.destination.name}
              address={trip.destination.address}
              time={trip.destination.dateTime}
            />
          </View>
          {/* Mapa */}
          <View style={styles.placeholderMap}>
            <Text style={styles.placeholderText}>
              Aquí irá el mapa cuando la app esté en producción
            </Text>
          </View>

          {/* Botón de viaje */}
          <AnimatedTripButton status={tripStatus} onPress={toggleTripStatus} />

          {/* Paradas */}
          <View style={styles.stopsSection}>
            {trip.plannedStops.map((stop, index) => (
              <StopItem
                key={index}
                title={stop.name}
                time={stop.dateTime}
                status={stop.status}
                duration={stop.duration}
              />
            ))}
          </View>
          </>
        ) : (
          <>
          </>
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7EFDF' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  placeholderMap: {
    height: 310,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  placeholderText: { color: '#555', fontStyle: 'italic' },
  card: {
    flex: 1,
    margin: 8,
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
