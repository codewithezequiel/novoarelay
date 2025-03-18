import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import PostTripForm from '~/components/PostTripForm';

export default function PostTripDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <PostTripForm eventId={id} />
    </View>
  );
}
