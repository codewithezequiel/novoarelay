import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import SupaImage from './SupaImage';
import SupaAvatarImage from './SupaAvatarImage';

export default function TRListItem({ report }) {
  const employeeImage = report.avatar_url;

  return (
    <Link href={`/towingreport/${report.id}`} asChild>
      <Pressable className="p-2">
        <View className="mb-3 max-w-screen-sm rounded-xl bg-white p-5 shadow-md">
          {/* Timestamp */}
          <Text className="text-xs font-semibold text-yellow-800">
            {new Date(report.created_at).toLocaleString()}
          </Text>

          {/* Status & Description
          <View className="mt-3">
            <Text
              className={`text-lg font-bold ${
                report.status === 'in_progress' ? 'text-orange-600' : 'text-green-600'
              }`}>
              {report.status === 'in_progress' ? '🚧 Towing in Progress' : '✅ Tow Completed'}
            </Text>
            <Text className="mt-1 text-sm text-gray-700" numberOfLines={3}>
              {report.description}
            </Text>
          </View> */}

          {/* Truck Image */}
          {report.image_url && (
            <SupaImage
              path={report.image_url}
              className="mt-4 aspect-video w-full rounded-xl border border-gray-300"
            />
          )}

          {/* Pickup & Dropoff Locations */}
          <View className="mt-4 space-y-2">
            <Text className="text-sm font-semibold text-gray-600">
              📍 Pickup: {report.pickup_location}
            </Text>
            {/* <Text className="text-sm text-gray-600">
              {Math.round(report.pickup_dist_meters / 1000)} km from you.
            </Text> */}
            <Text className="text-sm font-semibold text-gray-600">
              🚚 Dropoff: {report.dropoff_location}
            </Text>
            {/* <Text className="text-sm text-gray-600">
              {Math.round(report.dropoff_dist_meters / 1000)} km from you.
            </Text> */}
          </View>

          {/* Employee Info & Actions */}
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <SupaAvatarImage path={employeeImage} className="h-10 w-10 rounded-full border" />
              <View>
                <Text className="font-semibold text-gray-800">
                  {report.employee_full_name || 'Unknown Employee'}
                </Text>
                <Text className="text-sm text-gray-500">
                  {report.current_location ? `📌 ${report.current_location}` : 'Location Unknown'}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Ionicons name="share-outline" size={22} color="black" />
              <Ionicons name="bookmark-outline" size={22} color="black" />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
