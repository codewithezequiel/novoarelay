import HighlightCard from './HighlightCard';
import { View } from 'react-native';

export default function AdminHighlights() {
  return (
    <View className="flex-row flex-wrap justify-around gap-4 bg-black ">
      <HighlightCard title="My Trips" icon={require('~/assets/novoarelayroad.jpg')} value="3" />

      <HighlightCard
        title="Journey with NovoaRelay"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value="3"
      />

      <HighlightCard
        title="Total Employees"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="3"
      />

      <HighlightCard
        title="Regions Covered"
        icon={require('~/assets/novoarelaycity.jpg')}
        value="3"
      />

      <HighlightCard
        title="Total Company Trips"
        icon={require('~/assets/novoarelaytasks.jpg')}
        value="3"
      />

      <HighlightCard
        title="Fleet Size"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="3"
      />

      <HighlightCard
        title="Trips Dispatched"
        icon={require('~/assets/novoarelaycity.jpg')}
        value="3"
      />
      <HighlightCard
        title="Maintenance Logs"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="3"
      />

      <HighlightCard
        title="Client Accounts"
        icon={require('~/assets/novoarelaycity.jpg')}
        value="3"
      />
      <HighlightCard
        title="Completed Jobs"
        icon={require('~/assets/novoarelaymaintenance.jpg')}
        value="3"
      />
    </View>
  );
}
