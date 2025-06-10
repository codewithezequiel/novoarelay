import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useLocalSearchParams } from 'expo-router';

import MyTripsScreen from '~/app/screens/adminhomenavigator/MyTripsScreen';
import MyCompanyTripsScreen from '~/app/screens/adminhomenavigator/MyCompanyTrips';
import EmployeeHome from '~/app/screens/employeehomenavigator/EmployeeHome';
import NovoaRelayHomeLogo from './NovoaRelayHome';

const Tab = createMaterialTopTabNavigator();

export default function MiniPlayer() {
  const { role } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['85%', '20%'], []);

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
            <>
              <View className=" bg-black">
                <NovoaRelayHomeLogo />
              </View>
              <Tab.Navigator
                screenOptions={{
                  tabBarLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    color: 'gray', // Default; overridden by tint colors
                  },
                  tabBarStyle: {
                    backgroundColor: 'black',
                    elevation: 0,
                    shadowOpacity: 0,
                  },
                  tabBarActiveTintColor: 'black', // active label color
                  tabBarInactiveTintColor: 'white', // inactive label color

                  // Makes the indicator look like a pill/button
                  tabBarIndicatorStyle: {
                    backgroundColor: 'white', // the actual "button" background
                    height: '80%',
                    borderRadius: 20,
                    marginHorizontal: 0,
                    marginVertical: 5,
                  },
                  tabBarItemStyle: {
                    borderRadius: 20,
                  },
                }}>
                <Tab.Screen name="My Trips" component={MyTripsScreen} />
                <Tab.Screen name="Company Trips" component={MyCompanyTripsScreen} />
              </Tab.Navigator>
            </>
          ) : (
            <EmployeeHome />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
