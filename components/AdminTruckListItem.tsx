import { Text, View } from 'react-native';

interface Props {
  truck: {
    name: string;
    model: string;
    license_plate: string;
    year: number | null; // Handling null values
  };
}

export default function TruckListItem({ truck }: Props) {
  return (
    <View className="mb-4 rounded-lg border border-indigo-400 bg-zinc-900 p-4 shadow-md">
      <Text className="text-xl font-bold text-white">{truck.name}</Text>
      <Text className="text-lg text-gray-300">{truck.model}</Text>
      <Text className="text-lg text-gray-400">Plate: {truck.license_plate}</Text>
      <Text className="text-lg text-gray-400">Year: {truck.year ?? 'Unknown Year'}</Text>
    </View>
  );
}
