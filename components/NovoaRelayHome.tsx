import { Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  fontSize?: number;
  className?: string;
};

export default function NovoaRelayHomeLogo({ fontSize = 48, className }: Props) {
  return (
    <View className={`items-start justify-center ${className}`}>
      <MaskedView
        maskElement={
          <Text
            className="font-extrabold lowercase text-white"
            style={{ fontSize }}
            allowFontScaling={false}>
            novoarelay
          </Text>
        }>
        <LinearGradient
          colors={[
            '#d1d5db', // light gray
            '#9ca3af', // medium gray
            '#6b7280', // dark gray
            '#9ca3af',
            '#d1d5db',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: fontSize * 1.2,
            width: fontSize * 9, // adjust for text length
          }}
        />
      </MaskedView>
    </View>
  );
}
