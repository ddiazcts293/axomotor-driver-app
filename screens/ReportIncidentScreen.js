import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Modal, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../services/supabase_client';
import * as FileSystem from 'expo-file-system';
import mime from 'mime';
import * as ImageManipulator from 'expo-image-manipulator';

const incidentTypes = {
  Mecanico: ['Falla de frenos', 'Sobrecalentamiento de motor', 'Batería sin carga', 'Ponchadura'],
  Ruta: ['Desviación', 'Bloqueo en ruta', 'Atropellamiento', 'Choque', 'Congestión vehicular'],
  Carga: ['Daño a mercancía', 'Reparto', 'Conteo de mercancía', 'Robo'],
  Seguridad: ['Asalto', 'Problema de salud'],
};

const uploadImage = async (uri, userId) => {
  try {
    // 1. Comprimir y redimensionar la imagen
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080 } }], // ajusta según lo que necesites
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );

    const compressedUri = manipulatedImage.uri;
    const fileName = `${userId}/${Date.now()}.jpg`;
    const fileType = mime.getType(compressedUri) || 'image/jpeg';

    const fileInfo = await FileSystem.getInfoAsync(compressedUri);
    if (!fileInfo.exists) {
      console.error('El archivo no existe en la ruta:', compressedUri);
      return null;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: compressedUri,
      name: fileName,
      type: fileType,
    });

    const { data, error } = await supabase.storage
      .from('incident-images')
      .upload(fileName, formData.get('file'), {
        contentType: fileType,
        upsert: false,
      });

    if (error) {
      console.error('Error al subir imagen:', error.message);
      return null;
    }

    return fileName;
  } catch (err) {
    console.error('Error al preparar archivo:', err.message);
    return null;
  }
};


const IncidentScreen = ({ navigation }) => {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState(null);

  const handleSubmit = async () => {
  const userId = (await supabase.auth.getUser()).data.user.id;

  const uploadedPaths = [];
  for (const uri of images) {
    const path = await uploadImage(uri, userId);
    if (path) uploadedPaths.push(path);
  }

  // Aquí podrías guardar el incidente en tu base de datos
  console.log('Incidente enviado con imágenes:', uploadedPaths);
};


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (sub) => {
    setSelectedSubcategory(sub);
  };

  const handleOpenMap = () => {
    navigation.navigate('Viaje');
  };

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
      setImages((prev) => [...prev, ...newImages]);
    }

    setShowModal(false);
  };

  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => setFullImage(item)} style={styles.thumbnail}>
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, padding: 16, backgroundColor: '#F7EFDF' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tipo de incidente */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={styles.mainButtonText}>Tipo de incidente</Text>
        </TouchableOpacity>

        {showCategories && (
          <View style={styles.categoryBox}>
            {Object.keys(incidentTypes).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedCategory && (
          <View style={styles.subcategoryBox}>
            {incidentTypes[selectedCategory].map((sub, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subcategoryButton,
                  selectedSubcategory === sub && styles.selectedSubcategory,
                ]}
                onPress={() => handleSubcategorySelect(sub)}
              >
                <Text style={styles.subcategoryText}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Descripción */}
        <Text style={styles.label}>Descripción del incidente:</Text>
        <TextInput
          ref={inputRef}
          style={{ borderWidth: 1, padding: 10, minHeight: 80, backgroundColor: '#fff' }}
          placeholder="Escribe una descripción..."
          multiline
          onFocus={() => {
            setTimeout(() => {
              inputRef.current?.measure((fx, fy, width, height, px, py) => {
                scrollRef.current?.scrollTo({
                  y: py - 100, // Ajusta este valor según el tamaño del teclado
                  animated: true,
                });
              });
            }, 300); // Espera a que el teclado se abra
          }}
        />

        {/* Mapa */}
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
          <Text style={styles.mapButtonText}>Seleccionar ubicación en el mapa</Text>
        </TouchableOpacity>

        {/* Fotos */}
        <Text style={styles.label}>Fotos</Text>
        <View style={styles.imageGrid}>
          <FlatList
            data={[...images, 'add']}
            numColumns={3}
            scrollEnabled={false}
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

        {/* Botón enviar */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
          <Text style={styles.sendButtonText}>Enviar incidente</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de selección de fuente */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          {/* Fondo para cerrar modal */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          {/* Caja centrada */}
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Selecciona fuente</Text>
            {[
              { key: 'camera', label: 'Tomar foto con cámara', icon: 'camera' },
              { key: 'gallery', label: 'Elegir de galería', icon: 'images' },
              { key: 'esp32', label: 'Obtener foto de ESP32', icon: 'satellite-dish' },
            ].map(({ key, label, icon }) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  handleAddImage(key);
                }}
                style={styles.modalOption}
              >
                <View style={styles.iconRow}>
                  <FontAwesome5 name={icon} size={18} color="#333" style={{ marginRight: 10 }} />
                  <Text>{label}</Text>
                </View>
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
        <View style={styles.fullImageOverlay}>
          <Image source={{ uri: fullImage }} style={styles.fullImage} resizeMode="contain" />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setImages((prev) => prev.filter((img) => img !== fullImage));
              setFullImage(null);
            }}
          >
            <Text style={styles.deleteButtonText}>Eliminar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullImage(null)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  mainButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  mainButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  categoryBox: { marginBottom: 16 },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedCategory: { backgroundColor: '#d0e8ff' },
  categoryText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  subcategoryBox: { marginBottom: 16 },
  subcategoryButton: {
    backgroundColor: '#eaeaea',
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  selectedSubcategory: { backgroundColor: '#cce5ff' },
  subcategoryText: {
    textAlign: 'center',
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mapButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  mapButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageGrid: {
    marginBottom: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addPhotoBox: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 8,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default IncidentScreen;