import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import towingReports from '~/assets/towingReports.json';

export default function TowReportPage() {
  const { id } = useLocalSearchParams();
  const towingReport = towingReports.find((e) => e.id === id);

  return (
    <View className="mx-auto max-w-screen-sm flex-1 gap-3 bg-white p-5">
      <ScrollView>
        {/* Header */}
        <Stack.Screen
          options={{
            title: 'Tow Report',
            headerBackTitle: '+',
            headerTintColor: 'black',
          }}
        />

        {/* Main Image */}
        <Image
          source={{ uri: towingReport?.image_url }}
          className="mb-5 aspect-video w-full rounded-lg"
        />

        {/* Report Title */}
        <Text className="mb-3 text-3xl font-bold text-gray-800">
          {`${towingReport?.employee_fullName}'s Towing Report`}
        </Text>

        {/* Status Section */}
        <View className="mb-5 flex-row items-center">
          <Text
            className={`text-lg font-semibold ${
              towingReport?.status === 'in_progress' ? 'text-orange-600' : 'text-green-600'
            }`}>
            {towingReport?.status === 'in_progress' ? '🚧 Towing in Progress' : '✅ Tow Completed'}
          </Text>
        </View>

        {/* Description */}
        <Text className="mb-3 text-lg text-gray-700" numberOfLines={3}>
          {towingReport?.description || 'No description available.'}
        </Text>

        {/* Pickup & Dropoff Locations */}
        <View className="mb-5">
          <Text className="text-lg font-semibold text-gray-800">
            📍 Pickup: {towingReport?.pickupLocation || 'Location not provided'}
          </Text>
          <Text className="mt-1 text-lg font-semibold text-gray-800">
            🚚 Dropoff: {towingReport?.dropoffLocation || 'Location not provided'}
          </Text>
        </View>

        {/* Employee Info */}
        <View className="mb-5 flex-row items-center">
          <Image
            source={{ uri: towingReport?.employee_image_url }}
            className="mr-4 h-12 w-12 rounded-full"
          />
          <View>
            <Text className="text-lg font-semibold">
              {towingReport?.employee_fullName || 'Unknown Employee'}
            </Text>
            <Text className="text-sm text-gray-500">
              Live Location: {towingReport?.currentLocation || 'Location Unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-10 left-0 right-0 border-t-2 border-gray-400 p-4">
        <Pressable onPress={() => console.log('Hello')} className="mt-2 rounded-xl bg-red-400 p-3">
          <Text className="text-center text-lg font-bold text-white">
            Call {towingReport?.employee_fullName}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
