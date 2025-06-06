import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { View, Alert, Image, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);

      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => setAvatarUrl(fr.result as string);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image:', error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const image = result.assets[0];
      if (!image.uri) throw new Error('No image URI found.');

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Upload Error', error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View className="items-center space-y-4">
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          alt="Avatar"
          style={{ width: size, height: size, borderRadius: size / 2 }}
          className="object-cover"
        />
      ) : (
        <View
          style={{ width: size, height: size, borderRadius: size / 2 }}
          className="border border-zinc-400 bg-zinc-800"
        />
      )}

      <Pressable
        onPress={uploadAvatar}
        disabled={uploading}
        className={`mt-10 rounded-full px-6 py-2 ${uploading ? 'bg-zinc-500' : 'bg-green-600'}`}>
        <Text className="font-bold text-white">{uploading ? 'Uploading...' : 'Upload'}</Text>
      </Pressable>
    </View>
  );
}
