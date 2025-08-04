// screens/ReportIncidentScreen.js

import React, { useState } from 'react';
import { View,   Text, TextInput, Button, Modal, TouchableOpacity, Image, FlatList, StyleSheet, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../style/theme';

const incidentTypes = ['Mecánico', 'Ruta', 'Carga', 'Seguridad'];
const incidentDetails = {
  Mecánico: ['Falla de frenos', 'Fuga de combustible', 'Batería muerta'],
  Ruta: ['Desvío', 'Bloqueo de carretera'],
  Carga: ['Deslizamiento', 'Daño a mercancía'],
  Seguridad: ['Robo', 'Accidente'],
};

export default function ReportIncidentScreen() {
  const navigation = useNavigation();

  const [selectedType, setSelectedType] = useState('');
  const [selectedDetail, setSelectedDetail] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState(null);

  const handleAddImage = async (source) => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({ allowsMultipleSelection: false });
    } else if (source === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
    } else {
      // Simula foto del ESP32
      result = { assets: [{ uri: 'https://via.placeholder.com/300?text=ESP32' }] };
    }

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((img) => img.uri);
      setImages([...images, ...newImages]);
    }

    setShowModal(false);
  };

  const removeImage = (uri) => {
    setImages(images.filter((i) => i !== uri));
  };

  const renderImage = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setFullImage(item)}
      style={styles.imageWrapper}
    >
      <Image source={{ uri: item }} style={styles.thumbnail} />
      <TouchableOpacity style={styles.closeIcon} onPress={() => removeImage(item)}>
        <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.label}>Tipo de incidente</Text>
      <TextInput
        placeholder="Selecciona tipo"
        value={selectedType}
        onFocus={() => setSelectedType('')} // opcional para abrir modal de selección
        style={styles.input}
      />
      <FlatList
        data={incidentTypes}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              item === selectedType && { backgroundColor: colors.primaryBlue },
            ]}
            onPress={() => {
              setSelectedType(item);
              setSelectedDetail('');
            }}
          >
            <Text style={{ color: item === selectedType ? '#fff' : '#333' }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        style={{ marginBottom: 10 }}
      />

      <Text style={styles.label}>Incidente</Text>
      <FlatList
        data={incidentDetails[selectedType] || []}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              item === selectedDetail && { backgroundColor: colors.primaryBlue },
            ]}
            onPress={() => setSelectedDetail(item)}
          >
            <Text style={{ color: item === selectedDetail ? '#fff' : '#333' }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        style={{ marginBottom: 10 }}
      />

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => navigation.navigate('SelectLocationScreen')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Seleccionar ubicación en el mapa</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Describe el incidente..."
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.imageGrid}>
        <FlatList
          data={[...images, 'add']}
          numColumns={3}
          renderItem={({ item }) =>
            item === 'add' ? (
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={[styles.thumbnail, styles.addPhotoBox]}
              >
                <Text style={{ fontSize: 24, color: '#777' }}>＋</Text>
              </TouchableOpacity>
            ) : (
              renderImage({ item })
            )
          }
          keyExtractor={(item, index) => item + index}
        />
      </View>

      <Button title="Enviar incidente" onPress={() => console.log('Incidente enviado')} />

      {/* Modal de selección de fuente */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Selecciona fuente</Text>
            {['camera', 'gallery', 'esp32'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleAddImage(option)}
                style={styles.modalOption}
              >
                <Text>
                  {option === 'camera'
                    ? '📷 Tomar foto con cámara'
                    : option === 'gallery'
                    ? '🖼️ Elegir de galería'
                    : '📡 Obtener foto de ESP32'}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de imagen completa */}
      <Modal visible={!!fullImage} transparent animationType="fade">
        <TouchableOpacity style={styles.fullImageOverlay} onPress={() => setFullImage(null)}>
          <Image source={{ uri: fullImage }} style={styles.fullImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', marginBottom: 4, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  mapButton: {
    backgroundColor: colors.primaryBlue,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageGrid: { marginVertical: 10 },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 8,
    margin: 4,
  },
  addPhotoBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  imageWrapper: {
    position: 'relative',
    margin: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
    fullImageOverlay: {
    flex: 1,
    backgroundColor: '#000000dd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});