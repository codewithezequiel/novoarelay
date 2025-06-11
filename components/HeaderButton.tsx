import { forwardRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable } from 'react-native';

export const HeaderButton = forwardRef<typeof Pressable, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    return (
      <Pressable
        onPress={onPress}
        ref={ref}
        className="mx-4 items-center justify-center rounded-full bg-yellow-400 p-2 ">
        {({ pressed }) => (
          <FontAwesome
            name="info-circle"
            size={25}
            color="gray"
            style={{
              opacity: pressed ? 0.5 : 1,
            }}
          />
        )}
      </Pressable>
    );
  }
);
