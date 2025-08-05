import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../services/supabase';

export default function IncidentGalleryScreen() {
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const id = sessionData?.session?.user?.id;
      setUserId(id);
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAllImages(userId);
    }
  }, [userId]);

  const fetchAllImages = async (startPath = '') => {
    setLoading(true);
    const allImages = [];

    const exploreFolder = async (path) => {
      const { data: files, error } = await supabase.storage
        .from('incident-images')
        .list(path, { limit: 100 });

      if (error) {
        console.error(`Error en ${path || 'raíz'}:`, error.message);
        return;
      }

      for (const item of files) {
        const itemPath = path ? `${path}/${item.name}` : item.name;

        if (item.metadata?.isFolder) {
          await exploreFolder(itemPath);
        } else {
          const fullPath = itemPath;
          const { data: publicUrlData } = supabase.storage
            .from('incident-images')
            .getPublicUrl(fullPath);

          allImages.push({
            name: item.name,
            imageUrl: publicUrlData?.publicUrl || null,
            createdAt: item.created_at || null,
            folder: path || '',
          });
        }
      }
    };

    try {
      await exploreFolder(userId);
      setImages(allImages);

      const grouped = allImages.reduce((acc, image) => {
        const date = image.createdAt
          ? new Date(image.createdAt).toISOString().slice(0, 10)
          : 'Sin fecha';

        if (!acc[date]) acc[date] = [];
        acc[date].push(image);
        return acc;
      }, {});

      const groupInPairs = (data) => {
        const pairs = [];
        for (let i = 0; i < data.length; i += 2) {
          pairs.push(data.slice(i, i + 2));
        }
        return pairs;
      };

      const sectionsData = Object.entries(grouped).map(([date, images]) => ({
        title: date,
        data: groupInPairs(images),
      }));

      sectionsData.sort((a, b) => (a.title < b.title ? 1 : -1));
      setSections(sectionsData);
    } catch (err) {
      console.error('Error inesperado:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.reloadButton} onPress={() => fetchAllImages(userId)}>
        <Text style={styles.reloadText}>Recargar</Text>
      </TouchableOpacity>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `pair-${index}`}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((img, index) => (
              <View key={index} style={styles.card}>
                {img.imageUrl ? (
                  <Image source={{ uri: img.imageUrl }} style={styles.image} />
                ) : (
                  <Text style={styles.noImage}>Sin imagen</Text>
                )}
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  reloadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ccc',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  noImage: {
    color: '#888',
    fontStyle: 'italic',
  },
});
