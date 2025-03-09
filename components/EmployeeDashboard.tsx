import { Pressable, View, Text } from 'react-native';

export default function EmployeeDashboard() {
  return (
    <View className="mx-5 mt-6">
      <Pressable className="mt-4 rounded-lg bg-green-400 p-3">
        <Text className="text-center text-lg text-white">View Tasks</Text>
      </Pressable>
    </View>
  );
}
