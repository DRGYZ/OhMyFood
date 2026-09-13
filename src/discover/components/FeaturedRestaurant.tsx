import { Link } from "react-router";
import { cuisineLabel, type Restaurant } from "../restaurants";

interface FeaturedRestaurantProps {
  restaurant: Restaurant;
}

export function FeaturedRestaurant({ restaurant }: FeaturedRestaurantProps) {
  return (
    <section className="featured-section" aria-labelledby="featured-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Notre coup de cœur</span>
          <h2 id="featured-title">Une table à part</h2>
        </div>
        <span className="section-heading__aside">Sélection OhMyFood · Paris</span>
      </div>

      <article className="featured">
        <div className="featured__photo">
          <img
            src={restaurant.image.src}
            alt={restaurant.image.alt}
            width={restaurant.image.width}
            height={restaurant.image.height}
            loading="eager"
            fetchPriority="high"
          />
          <span className="featured__photo-label">Paris {restaurant.neighborhood} · {restaurant.area}</span>
        </div>
        <div className="featured__content">
          <span className="eyebrow">01 / Les tables de Paris</span>
          <h3>{restaurant.name}</h3>
          <p className="featured__description">{restaurant.description}</p>
          <div className="featured__facts">
            <span>{cuisineLabel(restaurant.cuisine)}</span>
            <span>{"€".repeat(restaurant.priceLevel)}</span>
            <span>{restaurant.serviceNote}</span>
          </div>
          <Link
            className="primary-link"
            to={"/restaurants/" + restaurant.slug}
          >
            Voir la fiche <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
