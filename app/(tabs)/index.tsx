import { Stack } from 'expo-router';
import { StyleSheet, View, Text, FlatList, ScrollView } from 'react-native';

import TRListItem from '~/components/TRListItem';
import towingReports from '~/assets/towingReports.json';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <FlatList
        data={towingReports.towing_reports}
        renderItem={({ item }) => (
          <View>
            <TRListItem report={item} />
          </View>
        )}
      />
    </>
  );
}
