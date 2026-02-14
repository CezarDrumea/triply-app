import DestinationCard from "../components/DestinationCard";
import SectionHeading from "../components/SectionHeading";
import { useTypedSelector } from "../store/hooks";

const Destinations = () => {
  const destinations = useTypedSelector((state) => state.catalog.destinations);

  return (
    <>
      <SectionHeading
        eyebrow="Destinations"
        title="Seasonal highlights with weather and mood"
        description="Get to know new locations."
      />
      <div className="grid destinations">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </>
  );
};

export default Destinations;
