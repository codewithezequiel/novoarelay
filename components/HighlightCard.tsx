import { View, Text, Image, ImageSourcePropType } from 'react-native';

interface Props {
  title: string;
  value: string | number;
  icon: ImageSourcePropType;
}

export default function HighlightCard({ title, icon, value }: Props) {
  return (
    <View className="w-48 items-center gap-4 p-4 px-4 py-6">
      <Image source={icon} className="h-32 w-48 rounded-lg" resizeMode="cover" />
      <Text className="text-center text-lg font-bold text-white">{value}</Text>
      <Text className="text-center text-lg font-semibold text-white" numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}
