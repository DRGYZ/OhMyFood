import { Link, useParams } from "react-router";
import { restaurantBySlug } from "../data/restaurants";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { SimplePage } from "../SimplePage";
import { browserConfirmationStorage, readConfirmation } from "./confirmation";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function displayDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day, 12));
}

export function ConfirmationPage() {
  const { slug } = useParams();
  const restaurant = slug ? restaurantBySlug(slug) : undefined;

  if (!restaurant) {
    return (
      <SimplePage
        eyebrow="OhMyFood · table introuvable"
        title="Cette table n'existe pas"
        message="Cette adresse ne figure pas dans notre sélection. Découvrez les quatre tables disponibles."
      />
    );
  }

  const snapshot = readConfirmation(browserConfirmationStorage(), restaurant.slug);
  const menuUrl = "/restaurants/" + restaurant.slug;

  if (!snapshot) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="booking-page booking-page--empty page-shell">
          <div className="booking-empty">
            <p className="eyebrow">Votre expérience · {restaurant.name}</p>
            <h1>Aucune réservation à afficher</h1>
            <p>Cette page affiche uniquement une réservation confirmée pendant votre session. Composez un menu pour commencer.</p>
            <div className="confirmation-actions">
              <Link className="primary-link" to={menuUrl}>Voir la carte <span aria-hidden="true">↗</span></Link>
              <Link to="/">Découvrir les tables</Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="booking-page page-shell">
        <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/#restaurants">Les tables</Link>
          <span aria-hidden="true">/</span>
          <Link to={menuUrl}>{restaurant.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Confirmation</span>
        </nav>
        <div className="confirmation">
          <div className="confirmation__heading">
            <span className="confirmation__mark" aria-hidden="true">✓</span>
            <p className="eyebrow">Votre table vous attend</p>
            <h1>Réservation confirmée</h1>
            <p>À bientôt chez {snapshot.restaurantName}, {snapshot.contact.firstName}.</p>
            <p className="confirmation__reference">Référence <strong>{snapshot.reference}</strong></p>
          </div>
          <div className="confirmation__details">
            <section aria-labelledby="confirmation-visit-title">
              <p className="eyebrow">Votre venue</p>
              <h2 id="confirmation-visit-title">Le rendez-vous</h2>
              <dl className="confirmation__facts">
                <div><dt>Restaurant</dt><dd>{snapshot.restaurantName}</dd></div>
                <div><dt>Date</dt><dd>{displayDate(snapshot.date)}</dd></div>
                <div><dt>Heure</dt><dd>{snapshot.time}</dd></div>
                <div><dt>Convives</dt><dd>{snapshot.partySize} {snapshot.partySize === 1 ? "personne" : "personnes"}</dd></div>
              </dl>
            </section>
            <section aria-labelledby="confirmation-menu-title">
              <p className="eyebrow">À table</p>
              <h2 id="confirmation-menu-title">Votre menu</h2>
              <ul className="confirmation__dishes">
                {snapshot.dishes.map((dish) => (
                  <li key={dish.itemId}>
                    <span><strong>{dish.quantity} ×</strong> {dish.name}</span>
                    <strong>{euro.format(dish.lineTotal)}</strong>
                  </li>
                ))}
              </ul>
              <div className="booking-summary__total">
                <span>Sous-total</span><strong>{euro.format(snapshot.subtotal)}</strong>
              </div>
              <p className="booking-summary__note">Le règlement se fait au restaurant.</p>
            </section>
          </div>
          <div className="confirmation-actions">
            <Link className="primary-link" to="/">Découvrir les tables <span aria-hidden="true">↗</span></Link>
            <Link to={menuUrl}>Voir {restaurant.name}</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
