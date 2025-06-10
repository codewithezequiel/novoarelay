import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MyTripsScreen from '../screens/adminhomenavigator/MyTripsScreen';
import MyCompanyTripsScreen from '../screens/adminhomenavigator/MyCompanyTrips';
import EmployeeHomeScreen from '../screens/employeehomenavigator/EmployeeHome';
import React, { useRef, useCallback, useMemo } from 'react';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import MiniPlayer from '~/components/MiniPlayer';
import EmployeeHome from '../screens/employeehomenavigator/EmployeeHome';

const Tab = createMaterialTopTabNavigator();

export default function HomeTabs() {
  const { role } = useLocalSearchParams();

  if (role === 'admin') {
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

  // For employee role, show map + employee home + mini player (no tabs)
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
