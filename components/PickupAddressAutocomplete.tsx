import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { getSuggestions, retrieveDetails } from '~/utils/AddressAutocomplete';

export default function PickupAddressAutocomplete({ onSelected }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();

  const { session } = useAuth();

  const onSuggestionClick = async (item) => {
    setSelectedLocation(item);
    setInput(item.name);
    setSuggestions([]);

    const details = await retrieveDetails(item.mapbox_id, session.access_token);
    console.log(details);
    onSelected(details);
  };

  const searcher = async () => {
    const data = await getSuggestions(input, session.access_token);
    console.log(data);
    if (data && Array.isArray(data.suggestions)) {
      setSuggestions(data.suggestions);
    } else {
      setSuggestions([]); // fallback to empty array
    }
  };

  return (
    <View>
      <View className="flex flex-row items-center justify-between">
        <TextInput
          placeholder="Enter pickup location"
          placeholderTextColor="#A1A1AA"
          value={input}
          onChangeText={setInput}
          className="mt-2 flex-1 rounded-lg border border-gray-700 bg-zinc-800 p-4 text-white"
        />
        <FontAwesome className="p-5" onPress={searcher} name="search" size={24} color="white" />
      </View>
      <View>
        <View className="gap-2">
          {Array.isArray(suggestions) &&
            suggestions.map((item) => (
              <Pressable
                onPress={() => onSuggestionClick(item)}
                key={item.name}
                className="rounded border border-gray-200 p-2">
                <Text className="font-bold text-white">{item.name}</Text>
                <Text className="text-white">{item.place_formatted}</Text>
              </Pressable>
            ))}
        </View>
      </View>
    </View>
  );
}
