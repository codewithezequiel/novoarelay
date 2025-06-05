import { Text, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  fontSize?: number;
  className?: string;
};

export default function NovoaRelayLogo({ fontSize = 48, className }: Props) {
  const lineHeight = fontSize * 1.3;

  return (
    <View className={`items-center justify-center ${className}`}>
      <MaskedView
        maskElement={
          <View>
            <Text
              className="text-center font-extrabold lowercase text-white"
              style={{ fontSize, lineHeight }}
              allowFontScaling={false}>
              novoa{'\n'}relay
            </Text>
          </View>
        }>
        <LinearGradient
          colors={['#d1d5db', '#9ca3af', '#6b7280', '#9ca3af', '#d1d5db']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: lineHeight * 2,
            width: 300,
          }}
        />
      </MaskedView>
    </View>
  );
}
