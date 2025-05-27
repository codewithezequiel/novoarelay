import { View, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import LifetimeComponent from './HighlightCard';
import AdminHighlights from './AdminHighlights';

export default function AdminDashboard() {
  const sections = [
    {
      label: 'Your Employees',
      icon: 'people-outline',
      route: '/profilescreens/admindashboard/youremployeeslist',
    },
    {
      label: 'Your Trucks',
      icon: 'bus-outline',
      route: '/profilescreens/admindashboard/AdminTrucks',
    },
    {
      label: 'Your Clients',
      icon: 'briefcase-outline',
      route: '/profilescreens/admindashboard/AdminClients',
    },
    {
      label: 'Add Truck',
      icon: 'bus-outline',
      route: '/profilescreens/admindashboard/AddTruckForm',
    },
    {
      label: 'Invite Employees',
      icon: 'person-add-outline',
      route: '/profilescreens/admindashboard/InviteEmployeesForm',
    },
    {
      label: 'Maintenance Logs',
      icon: 'person-add-outline',
      route: '/profilescreens/admindashboard/MaintenanceLogs',
    },
  ];

  return (
    <View className="gap-4 p-4 ">
      {sections.map((section, index) => (
        <Pressable
          key={index}
          onPress={() => router.push(section.route)}
          className="flex-row items-center justify-between rounded-lg border-2 border-zinc-800 bg-zinc-900 p-5 shadow-md transition active:scale-95"
          style={{ transition: 'transform 0.2s' }}>
          <View className="flex-row items-center">
            <Ionicons name={section.icon} size={28} color="#6366f1" />
            <Text className="ml-4 text-lg font-semibold text-white">{section.label}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={28} color="#a1a1aa" />
        </Pressable>
      ))}

      <View className="mt-5">
        <Text className="text-xl font-bold text-white">Lifetime highlights</Text>
      </View>
      <AdminHighlights />
    </View>
  );
}
