import { Link, useParams } from "react-router";
import { restaurantBySlug } from "../data/restaurants";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { useSelection } from "../selection/SelectionContext";
import { summarizeSelection } from "../selection/selection";
import { SimplePage } from "../SimplePage";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function ReservationPlaceholder() {
  const { slug } = useParams();
  const restaurant = slug ? restaurantBySlug(slug) : undefined;
  const { state } = useSelection();

  if (!restaurant) {
    return (
      <SimplePage
        eyebrow="OhMyFood · table introuvable"
        title="Cette table n'existe pas"
        message="Retrouvez les quatre tables parisiennes depuis la découverte."
      />
    );
  }

  const { dishes, itemCount, subtotal } = summarizeSelection(
    state,
    restaurant.id,
    restaurant.menu,
  );
  const menuUrl = "/restaurants/" + restaurant.slug;

  return (
    <>
      <SiteHeader />
      <main className="reservation-placeholder page-shell" id="main-content">
        <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/#restaurants">Les tables</Link>
          <span aria-hidden="true">/</span>
          <Link to={menuUrl}>{restaurant.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Réservation</span>
        </nav>
        <div className="reservation-placeholder__content">
          <p className="eyebrow">Votre expérience · {restaurant.name}</p>
          {itemCount === 0 ? (
            <>
              <h1>Composez d'abord votre menu</h1>
              <p>
                Votre sélection chez {restaurant.name} est vide. Choisissez au
                moins un plat pour poursuivre.
              </p>
              <Link className="primary-link" to={menuUrl}>
                Voir la carte <span aria-hidden="true">↗</span>
              </Link>
            </>
          ) : (
            <>
              <h1>Votre menu est prêt</h1>
              <p>
                {itemCount} {itemCount === 1 ? "plat sélectionné" : "plats sélectionnés"}
                {" · "}{euro.format(subtotal)}
              </p>
              <ul className="reservation-placeholder__dishes">
                {dishes.map(({ item, quantity }) => (
                  <li key={item.id}>{quantity} × {item.name}</li>
                ))}
              </ul>
              <Link className="primary-link" to={menuUrl}>
                Modifier mon menu <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
