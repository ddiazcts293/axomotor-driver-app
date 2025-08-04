import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../services/supabase_client';
import { globalStyles } from '../style/styles';
import { colors } from '../style/theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
          console.error('Error obteniendo sesión:', sessionError?.message);
          return;
        }

        const userId = session.user.id;

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error obteniendo perfil:', profileError.message);
          return;
        }

        setUserName(data.name);
      } catch (error) {
        console.error('Error general al obtener usuario:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Header flotante */}
      <View style={{
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
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/AxoMotor_logo.png')}
            style={{ width: 40, height: 40, marginRight: 12 }}
          />
          <Text style={{ color: colors.secondaryWhite, fontSize: 18 }}>
            Hola de nuevo, {userName || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Driver')}>
          <FontAwesome name="cog" size={24} color={colors.secondaryWhite} />
        </TouchableOpacity>
      </View>

      {/* Scroll con margen superior para no tapar contenido */}
      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingVertical: 20 }}>
        {/* Botón de pánico */}
        <TouchableOpacity
          style={{
            backgroundColor: '#D32F2F',
            padding: 16,
            marginTop: 15,
            marginHorizontal: 20,
            borderRadius: 8,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
          }}
        >
          <FontAwesome name="exclamation-triangle" size={35} color="#fff" style={{ marginRight: 20 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Botón de pánico
          </Text>
        </TouchableOpacity>

        {/* Sección de botones */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 25 }}>
          {[
            { title: 'Enlazar dispositivo', icon: 'link' },
            { title: 'Incidencias', icon: 'file-text' },
            { title: 'Reportar incidencia', icon: 'pencil-square-o' },
            { title: 'Galería de incidentes', icon: 'photo' },
            { title: 'Números de emergencia', icon: 'phone' },
            { title: 'Viajes', icon: 'truck' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: colors.primaryBlue,
                width: '40%',
                marginVertical: 10,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                elevation: 3,
              }}
              onPress={() => {
                if (item.title === 'Reportar incidencia') {
                  navigation.navigate('ReportIncident');
                } else if (item.title === 'Incidencias') {
                  navigation.navigate('Incidents');
                } else if (item.title === 'Galería de incidentes') {
                  navigation.navigate('IncidentGallery');
                } else if (item.title === 'Viajes') {
                  navigation.navigate('Viaje');
                } else {
                  console.log(item.title);
                }
              }}
            >
              <FontAwesome name={item.icon} size={24} color="#fff" style={{ marginBottom: 8 }} />
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
