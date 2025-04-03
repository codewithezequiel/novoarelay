import { Text, View } from 'react-native';

interface Props {
  client: {
    name: string;
    contact_number: number | null;
    email: string | null;
  };
}

export default function AdminClientListItem({ client }: Props) {
  return (
    <View className="mb-4 rounded-lg border border-indigo-400 bg-zinc-900 p-4">
      <Text className="text-lg font-bold text-white">{client.name}</Text>
      <Text className="text-sm text-zinc-400">
        Contact: {client.contact_number ? client.contact_number : 'N/A'}
      </Text>
      <Text className="text-sm text-zinc-400">Email: {client.email ? client.email : 'N/A'}</Text>
    </View>
  );
}
