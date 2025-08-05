
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../style/theme';

export default function OptionItem({ title, icon, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: colors.primaryBeige,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
      }}
    >
      <Image
        source={icon}
        style={{ width: 40, height: 40, marginBottom: 10, resizeMode: 'contain' }}
      />
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primaryBlue }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}