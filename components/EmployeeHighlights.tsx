import { useMyTrips } from '~/hooks/useMyTrips';
import HighlightCard from './HighlightCard';
import { View } from 'react-native';
import useJoinDate from '~/hooks/useJoinDate';

export default function EmployeeHighlights() {
  const { myTripCount } = useMyTrips();
  const { createdAt } = useJoinDate();

  return (
    <View className="flex-row flex-wrap justify-around gap-4 bg-black ">
      <HighlightCard
        title="Total Trips"
        icon={require('~/assets/novoarelayroad.jpg')}
        value={myTripCount}
      />

      <HighlightCard
        title="Journey with NovoaRelay"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value={createdAt}
      />

      <HighlightCard
        title="Vehicles Towed"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value={myTripCount}
      />

      <HighlightCard title="Logs Issued" icon={require('~/assets/novoarelaycity.jpg')} value="3" />
    </View>
  );
}
