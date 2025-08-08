import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { globalStyles } from '../style/styles';
import { colors } from '../style/theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [ username, setUsername ] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error('Error getting session:', sessionError?.message);
          return;
        }

        const userId = session.user.id;
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.warn('Error getting profile:', profileError.message);
          setUsername(session.user.email);
          return;
        }

        setUsername(data.name);
      } catch (error) {
        console.error('Error getting user session information:', error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <View style={globalStyles.container}>
      {/* Header flotante */}
      <View style={styles.floatingHeder}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/icon.png')}
            style={{ width: 40, height: 40, marginRight: 12 }}
          />
          <Text style={{ color: colors.secondaryWhite, fontSize: 18 }}>
            Hola de nuevo, {username || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('driver')}>
          <FontAwesome name="cog" size={24} color={colors.secondaryWhite} />
        </TouchableOpacity>
      </View>
      {/* Scroll con margen superior para no tapar contenido */}
      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingVertical: 20 }}>
        {/* Botón de pánico */}
        <TouchableOpacity style={styles.panicButton}>
          <FontAwesome name="exclamation-triangle" size={35} color="#fff" style={{ marginRight: 20 }} />
          <Text style={styles.panicButtonText}>Botón de pánico</Text>
        </TouchableOpacity>
        {/* Sección de botones */}
        <View style={styles.buttonSection}>
          {/* Butón para enlazar dispositivo */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('link_device')}>
            <FontAwesome name="link" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Enlazar dispositivo</Text>
          </TouchableOpacity>
          {/* Butón para consultar viaje */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('trip')}>
            <FontAwesome name="truck" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Consultar viaje</Text>
          </TouchableOpacity>
          {/* Butón para reportar incidencia */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('report_incident')}>
            <FontAwesome name="pencil-square" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Reportar incidencia</Text>
          </TouchableOpacity>
          {/* Butón para ver incidencias reportadas */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('incidents')}>
            <FontAwesome name="file-text" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Incidencias reportadas</Text>
          </TouchableOpacity>
          {/* Butón para ver galería de fotos subidas */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('incident_gallery')}>
            <FontAwesome name="photo" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Fotos subidas</Text>
          </TouchableOpacity>
          {/* Butón para ir a pantalla de números de emergencia 
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('emergency_numbers')}>
            <FontAwesome name="phone" size={24} color="#fff" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonText}>Números de emergencia</Text>
          </TouchableOpacity>*/}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingHeder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primaryBlue,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  buttonSection: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around', 
    marginTop: 25 
  },
  button: {
    backgroundColor: colors.primaryBlue,
    width: '40%',
    marginVertical: 10,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  panicButton: {
    backgroundColor: '#D32F2F',
    padding: 16,
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  panicButtonText: {
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
