import HighlightCard from './HighlightCard';
import { View } from 'react-native';
import { useCompanyTrips } from '~/hooks/useCompanyTrips';
import { useMyTrips } from '~/hooks/useMyTrips';
import { useAdminClientCount } from '~/hooks/useAdminClientCount';
import useEmployeeCount from '~/hooks/useEmployeeCount';
import useTruckCount from '~/hooks/useTruckCount';
import useJoinDate from '~/hooks/useJoinDate';

export default function AdminHighlights() {
  const { tripCount, loading } = useCompanyTrips();
  const { myTripCount } = useMyTrips();
  const { clientCount } = useAdminClientCount();
  const { employeeCount } = useEmployeeCount();
  const { truckCount } = useTruckCount();
  const { createdAt } = useJoinDate();

  return (
    <View className="flex-row flex-wrap justify-around gap-4 bg-black ">
      <HighlightCard
        title="My Trips"
        icon={require('~/assets/novoarelayroad.jpg')}
        value={myTripCount}
      />

      <HighlightCard
        title="Journey with NovoaRelay"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value={createdAt}
      />

      <HighlightCard
        title="Total Employees"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value={employeeCount}
      />

      <HighlightCard
        title="Total Company Trips"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value={loading ? '...' : tripCount.toString()}
      />

      <HighlightCard
        title="Fleet Size"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value={truckCount}
      />

      <HighlightCard
        title="Maintenance Logs"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="0"
      />

      <HighlightCard
        title="Client Accounts"
        icon={require('~/assets/novoarelaycity.jpg')}
        value={clientCount}
      />
    </View>
  );
}
