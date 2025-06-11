import { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MiniPlayer from '~/components/MiniPlayer';
import { Link } from 'expo-router';
import { HeaderButton } from '~/components/HeaderButton';

export default function HomeTabs() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  return (
    <SafeAreaView className="relative flex-1">
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 34.0522,
          longitude: location?.longitude || -118.2437,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        followsUserLocation={true}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="Current location"
          />
        )}
      </MapView>
      <View className="absolute right-2 top-20 p-2">
        <Link href="/modal" asChild>
          <HeaderButton />
        </Link>
      </View>
      <MiniPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
