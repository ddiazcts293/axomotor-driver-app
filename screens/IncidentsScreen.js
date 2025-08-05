import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { colors } from '../style/theme';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);

const incidents = [
  {
    id: '1',
    title: 'Fuga de combustible',
    type: 'Mecánico',
    timestamp: dayjs().subtract(2, 'hour'),
    status: 'abierto',
  },
  {
    id: '2',
    title: 'Golpe lateral',
    type: 'Accidente',
    timestamp: dayjs().subtract(1, 'day'),
    status: 'cerrado',
  },
];

const statusColors = {
  abierto: 'red',
  'en revisión': 'yellow',
  cerrado: 'green',
  descartado: 'gray',
};

export default function IncidentsScreen() {
    const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.statusDot(item.status)} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.timeText}>{dayjs(item.timestamp).fromNow()}</Text>
      </View>
      <Text style={styles.badge}>{item.type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 20 }}
      />

      {/* Botón para crear nueva incidencia */}
        <TouchableOpacity
        style={styles.newButton}
        onPress={() => navigation.navigate('ReportIncident')}
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
  statusDot: (status) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: statusColors[status],
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
