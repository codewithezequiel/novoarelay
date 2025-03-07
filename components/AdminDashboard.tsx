import { View } from 'react-native';
import InviteDropdown from './InviteDropdown';
import AddTruckForm from './AddTruckForm';

export default function AdminDashboard() {
  return (
    <View>
      <AddTruckForm />
      <InviteDropdown />
    </View>
  );
}
