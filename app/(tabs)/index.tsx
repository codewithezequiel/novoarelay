import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet } from 'react-native';

import MapView from 'react-native-maps';
import MiniPlayer from '~/components/MiniPlayer';

const Tab = createMaterialTopTabNavigator();

export default function HomeTabs() {
  return (
    <View className="relative flex-1">
      {/* Map fills the screen */}
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 34.0522,
          longitude: -118.2437,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      />
      {/* Bottom sheet absolutely positioned */}
      <MiniPlayer />
    </View>
  );
}
