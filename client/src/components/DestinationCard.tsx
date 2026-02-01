import type { Destination } from "../types";

const DestinationCard = ({ destination }: { destination: Destination }) => {
  return (
    <article className="card destination-card">
      <div className="media">
        <img src={destination.image} alt={destination.name} loading="lazy" />
      </div>

      <div className="card-body">
        <div>
          <p className="eyebrow">{destination.country}</p>
          <h3>{destination.name}</h3>
          <p className="muted">{destination.highlight}</p>
        </div>

        <div className="meta-row">
          <span className="pill">{destination.temperature}</span>
          <span className="pill">Best in {destination.season}</span>
        </div>
      </div>
    </article>
  );
};

export default DestinationCard;
