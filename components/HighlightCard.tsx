import { View, Text, Image, ImageSourcePropType, Dimensions } from 'react-native';

interface Props {
  title: string;
  value: string | number;
  icon: ImageSourcePropType;
}

export default function HighlightCard({ title, icon, value }: Props) {
  return (
    <View className="w-1/2 p-2 md:w-1/3 lg:w-1/4">
      <View className="max-h-72 items-center rounded-xl bg-black p-2">
        <Image source={icon} className=" max-h-32 max-w-48 rounded-xl" resizeMode="contain" />
        <Text className="mt-2 text-center text-lg font-bold text-white">{value}</Text>
        <Text className="text-center text-lg font-semibold text-white" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </View>
  );
}
