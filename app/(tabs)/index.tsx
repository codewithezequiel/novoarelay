import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MyTripsScreen from '../screens/adminhomenavigator/MyTripsScreen';
import MyCompanyTripsScreen from '../screens/adminhomenavigator/MyCompanyTrips';
import EmployeeHomeScreen from '../screens/employeehomenavigator/EmployeeHome'; // Assuming this is the employee screen

const Tab = createMaterialTopTabNavigator();

export default function HomeTabs() {
  const { role } = useLocalSearchParams(); // Get the role passed from TabLayout

  // If the role is 'admin', show the top tabs; otherwise, show employee home screen
  if (role === 'admin') {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold', textTransform: 'none' },
            tabBarIndicatorStyle: { backgroundColor: 'white', height: 3 },
            tabBarStyle: { backgroundColor: 'black' },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="My Trips" component={MyTripsScreen} />
          <Tab.Screen name="Company Trips" component={MyCompanyTripsScreen} />
        </Tab.Navigator>
      </View>
    );
  }

  // If the role is 'employee', show the employee home screen without top tabs
  return <EmployeeHomeScreen />;
}
