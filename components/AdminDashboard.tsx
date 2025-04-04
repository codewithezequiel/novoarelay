import { View, Text, Pressable, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

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
  ];

  return (
    <View className="gap-4 ">
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

      <View className="mt-8 gap-5 rounded-xl bg-black p-4">
        <Text className="mb-4 text-xl font-bold text-white">Lifetime Highlights</Text>

        <View className="mb-4 flex-row justify-around gap-5">
          <View className="items-center">
            <Image
              source={require('~/assets/novoarelayroad.jpg')}
              className="h-32 w-48 rounded-lg"
              resizeMode="cover"
            />
            <Text className="mt-2 text-lg font-semibold text-white">Total Trips</Text>
          </View>
          <View className="items-center">
            <Image
              source={require('~/assets/novoarelaytasks.jpg')}
              className="h-32 w-48 rounded-lg"
              resizeMode="cover"
            />
            <Text className="mt-2 text-lg font-semibold text-white">Assigned Trips</Text>
          </View>
        </View>

        <View className="flex-row justify-around gap-5">
          <View className="items-center">
            <Image
              source={require('~/assets/novoarelaymaintenance.jpg')}
              className="h-32 w-48 rounded-lg"
              resizeMode="cover"
            />
            <Text className="mt-2 text-lg font-semibold text-white">Maintenance Requests</Text>
          </View>
          <View className="items-center">
            <Image
              source={require('~/assets/novoarelaycity.jpg')}
              className="h-32 w-48 rounded-lg"
              resizeMode="cover"
            />
            <Text className="mt-2 text-lg font-semibold text-white">Client Cities</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
