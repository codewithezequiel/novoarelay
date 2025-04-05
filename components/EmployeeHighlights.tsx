import HighlightCard from './HighlightCard';
import { View } from 'react-native';

export default function EmployeeHighlights() {
  return (
    <View className="flex-row flex-wrap justify-around gap-4 bg-black ">
      <HighlightCard title="Total Trips" icon={require('~/assets/novoarelayroad.jpg')} value="3" />

      <HighlightCard
        title="Journey with NovoaRelay"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value="3"
      />

      <HighlightCard
        title="Vehicles Towed"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="3"
      />

      <HighlightCard
        title="Cities Visited"
        icon={require('~/assets/novoarelaycity.jpg')}
        value="3"
      />
    </View>
  );
}
