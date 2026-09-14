import { useRef } from "react";
import { Link, useLocation, useParams } from "react-router";
import { restaurantBySlug } from "../data/restaurants";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { SimplePage } from "../SimplePage";
import { useScrollReveal } from "../motion/useScrollReveal";
import { discoverReturnTo } from "../navigation/discoverReturn";
import { browserConfirmationStorage, readConfirmation } from "./confirmation";
import { formatFrenchDate } from "./dates";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function ConfirmationPage() {
  const { slug } = useParams();
  const pageRef = useRef<HTMLElement>(null);
  useScrollReveal(pageRef, slug ?? "");
  const location = useLocation();
  const returnTo = discoverReturnTo(location.state);
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
        <main id="main-content" className="booking-page booking-page--empty booking-page--confirmation-empty page-shell">
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
      <main id="main-content" className="booking-page booking-page--confirmation page-shell" ref={pageRef}>
        <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
          <Link to={returnTo}>Les tables</Link>
          <span aria-hidden="true">/</span>
          <Link to={menuUrl} state={{ discoverReturnTo: returnTo }}>{restaurant.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Confirmation</span>
        </nav>
        <article className="confirmation">
          <header className="confirmation__hero" data-scroll-reveal>
            <div className="confirmation__hero-copy">
              <div className="confirmation__status">
                <span className="confirmation__mark" aria-hidden="true">✓</span>
                <p className="eyebrow">Réservation confirmée</p>
              </div>
              <h1>Votre table vous attend.</h1>
              <p className="confirmation__welcome">À bientôt chez <strong>{snapshot.restaurantName}</strong>, {snapshot.contact.firstName}.</p>
              <div className="confirmation__hero-facts" aria-label="Votre rendez-vous">
                <span><time dateTime={snapshot.date}>{formatFrenchDate(snapshot.date)}</time></span>
                <span><time dateTime={snapshot.time}>{snapshot.time}</time></span>
                <span>{snapshot.partySize} {snapshot.partySize === 1 ? "personne" : "personnes"}</span>
              </div>
              <div className="confirmation__reference">
                <span>Votre référence</span>
                <strong>{snapshot.reference}</strong>
              </div>
            </div>
            <div className="confirmation__image">
              <img src={restaurant.image.src} alt="" width={restaurant.image.width} height={restaurant.image.height} />
            </div>
          </header>
          <div className="confirmation__details">
            <section className="confirmation__visit" aria-labelledby="confirmation-visit-title" data-scroll-reveal>
              <p className="eyebrow">01 / Votre rendez-vous</p>
              <h2 id="confirmation-visit-title">Le moment choisi</h2>
              <dl className="confirmation__facts">
                <div><dt>Restaurant</dt><dd>{snapshot.restaurantName}</dd></div>
                <div><dt>Date</dt><dd><time dateTime={snapshot.date}>{formatFrenchDate(snapshot.date)}</time></dd></div>
                <div><dt>Heure</dt><dd><time dateTime={snapshot.time}>{snapshot.time}</time></dd></div>
                <div><dt>Convives</dt><dd>{snapshot.partySize} {snapshot.partySize === 1 ? "personne" : "personnes"}</dd></div>
                <div className="confirmation__contact"><dt>Contact</dt><dd>{snapshot.contact.firstName} {snapshot.contact.lastName}<small>{snapshot.contact.email}<br />{snapshot.contact.phone}</small></dd></div>
              </dl>
            </section>
            <section className="confirmation__menu" aria-labelledby="confirmation-menu-title" data-scroll-reveal>
              <p className="eyebrow">02 / À votre table</p>
              <h2 id="confirmation-menu-title">Votre menu</h2>
              <ul className="confirmation__dishes">
                {snapshot.dishes.map((dish) => (
                  <li key={dish.itemId}>
                    <span><strong>{dish.name}</strong><small>{dish.quantity} × {euro.format(dish.unitPrice)}</small></span>
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
          <div className="confirmation-actions" data-scroll-reveal>
            <div>
              <p className="eyebrow">La suite</p>
              <p>Une autre table pour un autre moment ?</p>
            </div>
            <Link className="primary-link" to="/">Découvrir les tables <span aria-hidden="true">↗</span></Link>
            <Link to={menuUrl} state={{ discoverReturnTo: returnTo }}>Voir {restaurant.name}</Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
