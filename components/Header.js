import { View, Text } from 'react-native';
import { globalStyles } from '../style/styles';

export default function Header({ title }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={globalStyles.headerTitle}>{title}</Text>
    </View>
  );
}
