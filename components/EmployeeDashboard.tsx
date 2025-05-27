import { View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import EmployeeHighlights from './EmployeeHighlights';

export default function EmployeeDashboard() {
  const sections = [
    {
      label: 'Your Assigned Truck',
      icon: 'bus-outline',
      route: '/profilescreens/admindashboard/AdminTrucks',
    },
    {
      label: 'Your Jobs',
      icon: 'briefcase-outline',
      route: '/profilescreens/employeedashboard/YourJobs',
    },
    {
      label: 'Maintenance Requests',
      icon: 'construct-outline',
      route: '/profilescreens/employeedashboard/MaintenanceRequest',
    },
    {
      label: 'Report an Issue',
      icon: 'alert-circle-outline',
      route: '/profilescreens/employeedashboard/ReportIssue',
    },
  ];

  return (
    <View className="gap-4 p-4">
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
      <EmployeeHighlights />
    </View>
  );
}
