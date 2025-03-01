import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import SupaImage from './SupaImage';
import SupaAvatarImage from './SupaAvatarImage';

export default function TRListItem({ report }) {
  const employeeImage = report.profiles.avatar_url;

  return (
    <Link href={`/towingreport/${report.id}`} asChild>
      <Pressable className="p-2">
        <View className="mb-2 max-w-screen-sm rounded-xl bg-white p-5 shadow-md">
          {/* Timestamp */}
          <Text className="text-sm font-semibold  text-yellow-800">
            {new Date(report.created_at).toLocaleString()}
          </Text>

          {/* Row for Status, Description & Truck Image */}
          <View className="mt-2 flex-row space-x-4">
            {/* Left Side: Status & Description */}
            <View className="flex-1 gap-2">
              <Text
                className={`text-lg font-bold ${
                  report.status === 'in_progress' ? 'text-orange-600' : 'text-green-600'
                }`}>
                {report.status === 'in_progress' ? '🚧 Towing in Progress' : '✅ Tow Completed'}
              </Text>
              <Text className="mt-1 text-gray-700" numberOfLines={3}>
                {report.description}
              </Text>
            </View>

            {/* Right Side: Truck Image */}
            {report.image_url && (
              <SupaImage path={report.image_url} className="aspect-video w-2/5 rounded-xl " />
            )}
          </View>

          {/* Pickup & Dropoff Locations */}
          <View className="mt-2 flex-row gap-5">
            <Text className="text-sm font-semibold text-gray-600">
              📍 Pickup: {report.pickup_location}
            </Text>
            <Text className="text-sm font-semibold text-gray-600">
              🚚 Dropoff: {report.dropoff_location}
            </Text>
          </View>

          {/* Employee Info & Action Icons */}
          <View className="mt-3 flex-row items-center justify-between">
            {/* Employee Info */}
            <View className="flex-row items-center gap-3">
              <SupaAvatarImage path={employeeImage} className="h-10 w-10 rounded-full" />
              <View>
                <Text className="font-semibold">
                  {report.employee_full_name || 'Unknown Employee'}
                </Text>
                <Text className="text-sm text-gray-500">
                  Live Location: {report.current_location || 'Location Unknown'}
                </Text>
              </View>
            </View>

            {/* Action Icons */}
            <View className="flex-row gap-3">
              <Ionicons name="share-outline" size={24} color="black" />
              <Ionicons name="bookmark-outline" size={24} color="black" />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
