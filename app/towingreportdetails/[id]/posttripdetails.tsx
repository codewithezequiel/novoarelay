import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import PostTripForm from '~/components/PostTripForm';

export default function PostTripDetails() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Post Trip Details',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />
      <View className="flex-1 bg-black">
        <PostTripForm eventId={id} />
      </View>
    </>
  );
}
