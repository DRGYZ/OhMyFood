import { Link } from "react-router";
import {
  cuisineLabel,
  dietaryLabel,
  type Restaurant,
} from "../restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  return (
    <article className="restaurant-card">
      <Link
        className="restaurant-card__link"
        to={"/restaurants/" + restaurant.slug}
        aria-label={"Voir la fiche de " + restaurant.name}
      >
        <div className="restaurant-card__photo">
          <img
            src={restaurant.image.src}
            alt={restaurant.image.alt}
            width={restaurant.image.width}
            height={restaurant.image.height}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="restaurant-card__content">
          <span className="restaurant-card__number" aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
          <h3>{restaurant.name}</h3>
          <p className="restaurant-card__location">
            {restaurant.area} · Paris {restaurant.neighborhood}
          </p>
          <p className="restaurant-card__description">{restaurant.description}</p>
          <div className="restaurant-card__bottom">
            <span>{cuisineLabel(restaurant.cuisine)}</span>
            <span aria-label={"Gamme de prix indicative, " + restaurant.priceLevel + " symboles euro"}>
              {"€".repeat(restaurant.priceLevel)}
            </span>
          </div>
          {restaurant.dietaryOptions.length > 0 && (
            <span className="restaurant-card__dietary">
              {dietaryLabel(restaurant.dietaryOptions[0])}
            </span>
          )}
          <span className="restaurant-card__action">
            Voir la fiche <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
