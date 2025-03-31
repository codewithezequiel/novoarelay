import { View, Text, Image } from 'react-native';
import SupaAvatarImage from './SupaAvatarImage';

interface Props {
  MyEmployee: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
}

export default function EmployeeListItem({ MyEmployee }: Props) {
  return (
    <View className="flex-row items-center border-b border-zinc-800 p-4">
      <SupaAvatarImage
        path={MyEmployee.avatarUrl}
        className="h-12 w-12 rounded-full border border-gray-500"
      />
      <View className="mx-5">
        <Text className="text-lg font-bold text-white">
          {MyEmployee.firstName} {MyEmployee.lastName}
        </Text>
      </View>
    </View>
  );
}
