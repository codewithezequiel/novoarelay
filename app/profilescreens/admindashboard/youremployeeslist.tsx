import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import EmployeeListItem from '~/components/EmployeeListItem';

export default function EmployeesList() {
  const { session } = useAuth();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const { data: myData, error: myDataError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();

      if (myDataError) throw myDataError;

      const { data: myEmployees, error: employeesError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url') // Include profile picture
        .eq('company_id', myData.company_id);

      if (employeesError) throw employeesError;

      setEmployees(myEmployees || []);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
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
        <Text className="mb-4 text-2xl text-white">Employees List</Text>

        {employees.length > 0 ? (
          <FlatList
            data={employees}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <EmployeeListItem
                MyEmployee={{
                  firstName: item.first_name,
                  lastName: item.last_name,
                  avatarUrl: item.avatar_url,
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
