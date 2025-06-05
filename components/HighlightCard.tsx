import { View, Text, Image, ImageSourcePropType, Dimensions } from 'react-native';

interface Props {
  title: string;
  value: string | number;
  icon: ImageSourcePropType;
}

export default function HighlightCard({ title, icon, value }: Props) {
  return (
    <View className="w-1/2 p-2 md:w-1/2">
      <View className="max-h-72 rounded-xl bg-black p-2">
        <View className="aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-lg bg-black">
          <Image
            source={icon}
            className="h-full max-w-56 sm:max-w-56" // 🔧 Stretch image to fill container
            resizeMode="contain" // 🔧 Fill container without leaving space
          />
        </View>
        <Text className="mt-2 text-center text-lg font-bold text-white">{value}</Text>
        <Text className="text-center text-lg font-semibold text-white" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}
