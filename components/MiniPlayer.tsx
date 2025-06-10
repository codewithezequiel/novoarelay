import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useLocalSearchParams } from 'expo-router';

import MyTripsScreen from '~/app/screens/adminhomenavigator/MyTripsScreen';
import MyCompanyTripsScreen from '~/app/screens/adminhomenavigator/MyCompanyTrips';
import EmployeeHome from '~/app/screens/employeehomenavigator/EmployeeHome';

const Tab = createMaterialTopTabNavigator();

export default function MiniPlayer() {
  const { role } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['85%', '15%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('MiniPlayer sheet index:', index);
  }, []);

  return (
    <View className="absolute bottom-0 left-0 right-0 h-[100%]">
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        backgroundStyle={{ backgroundColor: 'black' }}
        handleIndicatorStyle={{ backgroundColor: 'white' }}>
        <BottomSheetView className="m-2 h-full flex-1 bg-black p-2">
          {role === 'admin' ? (
            <Tab.Navigator
              screenOptions={{
                tabBarLabelStyle: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  textTransform: 'none',
                },
                tabBarIndicatorStyle: {
                  backgroundColor: 'white',
                  height: 3,
                },
                tabBarStyle: { backgroundColor: '#000' },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'gray',
              }}>
              <Tab.Screen name="MyTrips" component={MyTripsScreen} />
              <Tab.Screen name="CompanyTrips" component={MyCompanyTripsScreen} />
            </Tab.Navigator>
          ) : (
            <EmployeeHome />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
