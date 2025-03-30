import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import SupaImage from './SupaImage';
import SupaAvatarImage from './SupaAvatarImage';

export default function TRListItem({ report }) {
  const employeeImage = report.profiles.avatar_url;
  const employeeFirstName = report.profiles.first_name;
  const employeeLastName = report.profiles.last_name;

  return (
    <Link href={`/towingreportdetails/${report.id}`} asChild>
      <Pressable className="w-full">
        <View className="mb-4 w-full max-w-screen-sm rounded-2xl bg-zinc-800 p-5 shadow-lg">
          {/* Timestamp */}
          <View className="mb-4 border-b border-gray-700 pb-2">
            <Text className="text-sm font-medium text-pink-500">
              {new Date(report.created_at).toLocaleString()}
            </Text>
          </View>

          {/* Status */}
          <Text className="font-semibold text-white">Trip status:</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Ionicons
              name={report.status === 'in_progress' ? 'time-outline' : 'checkmark-circle-outline'}
              size={20}
              color={report.status === 'in_progress' ? '#f97316' : '#10b981'}
            />
            <Text
              className={`text-lg font-bold ${
                report.status === 'in_progress' ? 'text-orange-500' : 'text-green-500'
              }`}>
              {report.status === 'in_progress' ? 'Towing in Progress' : 'Tow Completed'}
            </Text>
          </View>

          {/* Truck Image */}
          {report.image_url && (
            <SupaImage
              path={report.image_url}
              className="mt-4 aspect-video w-full rounded-lg border border-gray-600 shadow-md"
            />
          )}

          {/* Pickup & Dropoff Locations */}
          <View className="mt-4 space-y-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="location-outline" size={18} color="white" />
              <Text className="text-sm font-medium text-white">
                Pickup: {report.pickup_location}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Ionicons name="navigate-outline" size={18} color="white" />
              <Text className="text-sm font-medium text-white">
                Dropoff: {report.dropoff_location}
              </Text>
            </View>
          </View>

          {/* Employee Info & Actions */}
          <View className="mt-5 flex-row items-center justify-between">
            {/* Employee Details */}
            <View className="flex-row items-center gap-3">
              <SupaAvatarImage
                path={employeeImage}
                className="h-12 w-12 rounded-full border border-gray-500"
              />
              <View>
                <Text className="font-semibold text-white">
                  {employeeFirstName || 'Unknown Employee'}
                </Text>
                <Text className="text-sm text-gray-400">
                  {report.current_location ? `📌 ${report.current_location}` : 'Location Unknown'}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="flex-row gap-4">
              <Pressable>
                <Ionicons name="share-outline" size={24} color="white" />
              </Pressable>
              <Pressable>
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
