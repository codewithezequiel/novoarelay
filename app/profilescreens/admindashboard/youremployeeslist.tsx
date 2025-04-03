import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import EmployeeListItem from '~/components/EmployeeListItem';

export default function EmployeesList() {
  const { session } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    try {
      const { data: myData, error: myDataError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session?.user?.id)
        .single();

      if (myDataError) throw myDataError;
      if (!myData) throw new Error('Company ID not found');

      const { data: myEmployees, error: employeesError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('company_id', myData.company_id);

      if (employeesError) throw employeesError;

      setEmployees(myEmployees || []);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Employees',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
        }}
      />
      <View className="h-full bg-black p-5">
        {loading ? (
          <ActivityIndicator size="large" color="#c8b6ff" />
        ) : employees.length > 0 ? (
          <FlatList
            className="p-2"
            data={employees}
            keyExtractor={(item) => item.first_name + item.last_name} // Unique key
            renderItem={({ item }) => (
              <EmployeeListItem
                MyEmployee={{
                  firstName: item.first_name,
                  lastName: item.last_name,
                  avatarUrl: item.avatar_url, // Correct prop
                }}
              />
            )}
          />
        ) : (
          <Text className="text-gray-400">No employees found.</Text>
        )}
      </View>
    </>
  );
}
