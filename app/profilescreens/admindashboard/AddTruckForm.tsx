import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '~/utils/supabase';
import { useAuth } from '~/contexts/AuthProvider';
import { Stack } from 'expo-router';

interface FormData {
  name: string;
  model: string;
  plate_number: string;
  year: string;
}

export default function TruckForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const { session } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      // Retrieve company_id from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id) // Assuming user_id is the unique identifier
        .single();

      if (profileError) {
        console.error('Error fetching company_id:', profileError.message);
        return;
      }

      const companyId = profileData?.company_id;

      // Insert truck data along with the company_id
      const { error } = await supabase.from('trucks').insert([
        {
          name: data.name,
          license_plate: data.plate_number,
          model: data.model,
          year: data.year,
          company_id: companyId, // Add company_id here
        },
      ]);

      if (error) {
        console.log(error);
        console.error('Error inserting truck:', error.message);
        return;
      }

      alert('Truck added successfully!');
      reset();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Truck Form',
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'black' },
        }}
      />
      <View className="flex-1 justify-center  bg-black p-5">
        <Text className="mb-5 text-center text-xl font-bold text-white">Add Your Truck</Text>

        {/* Truck Name Input */}
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Truck name is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Truck Name"
                value={value}
                onChangeText={onChange}
                className="mb-2 rounded-xl bg-zinc-800 p-3 font-bold text-white"
                placeholderTextColor="gray"
              />
              {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
            </>
          )}
        />

        {/* Truck Model Input */}
        <Controller
          control={control}
          name="model"
          rules={{ required: 'Model is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Truck Model"
                value={value}
                onChangeText={onChange}
                className="mb-2 rounded-xl bg-zinc-800 p-3 font-bold text-white"
                placeholderTextColor="gray"
              />
              {errors.model && <Text className="text-red-500">{errors.model.message}</Text>}
            </>
          )}
        />

        {/* Plate Number Input */}
        <Controller
          control={control}
          name="plate_number"
          rules={{ required: 'Plate number is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Plate Number"
                value={value}
                onChangeText={onChange}
                className="mb-2 rounded-xl bg-zinc-800 p-3 font-bold text-white"
                placeholderTextColor="gray"
              />
              {errors.plate_number && (
                <Text className="text-red-500">{errors.plate_number.message}</Text>
              )}
            </>
          )}
        />

        {/* Year Input */}
        <Controller
          control={control}
          name="year"
          rules={{ required: 'Year is required' }}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                placeholder="Year"
                value={value}
                onChangeText={onChange}
                className="mb-2 rounded-xl bg-zinc-800 p-3 font-bold text-white"
                placeholderTextColor="gray"
              />
              {errors.year && <Text className="text-red-500">{errors.year.message}</Text>}
            </>
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className={`mt-4 rounded-md bg-blue-500 p-4 ${isSubmitting ? 'opacity-50' : ''}`}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white">Add Truck</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
