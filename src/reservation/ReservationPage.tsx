import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { restaurantBySlug, type Restaurant } from "../data/restaurants";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { useSelection } from "../selection/SelectionContext";
import { summarizeSelection, type SelectedDish } from "../selection/selection";
import { SimplePage } from "../SimplePage";
import { getAvailability } from "./availability";
import { bookingWindow, isBookingDate } from "./dates";
import {
  browserConfirmationStorage,
  createConfirmationSnapshot,
  saveConfirmation,
} from "./confirmation";
import {
  validateReservation,
  type ReservationErrors,
  type ReservationField,
  type ReservationFields,
} from "./validation";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

type AvailabilityState =
  | { status: "initial" | "loading" | "empty" | "error"; key: string }
  | { status: "success"; key: string; times: string[] };

const fieldOrder: ReservationField[] = [
  "partySize", "date", "time", "firstName", "lastName", "email", "phone",
];

function MenuReview({
  restaurant,
  dishes,
  itemCount,
  subtotal,
}: {
  restaurant: Restaurant;
  dishes: SelectedDish[];
  itemCount: number;
  subtotal: number;
}) {
  return (
    <aside className="booking-summary" aria-labelledby="booking-summary-title">
      <p className="eyebrow">Votre moment à table</p>
      <h2 id="booking-summary-title">Votre menu</h2>
      <p className="booking-summary__restaurant">{restaurant.name} · Paris {restaurant.neighborhood}</p>
      <ul className="booking-summary__list">
        {dishes.map(({ item, quantity, lineTotal }) => (
          <li key={item.id}>
            <span><strong>{quantity} ×</strong> {item.name}</span>
            <strong>{euro.format(lineTotal)}</strong>
          </li>
        ))}
      </ul>
      <div className="booking-summary__total">
        <span>Sous-total · {itemCount} {itemCount === 1 ? "plat" : "plats"}</span>
        <strong>{euro.format(subtotal)}</strong>
      </div>
      <Link to={"/restaurants/" + restaurant.slug}>Modifier mon menu <span aria-hidden="true">↗</span></Link>
      <p className="booking-summary__note">Le règlement se fait au restaurant.</p>
    </aside>
  );
}

function ReservationExperience({
  restaurant,
  dishes,
  itemCount,
  subtotal,
}: {
  restaurant: Restaurant;
  dishes: SelectedDish[];
  itemCount: number;
  subtotal: number;
}) {
  const navigate = useNavigate();
  const { dispatch } = useSelection();
  const [fields, setFields] = useState<ReservationFields>({
    partySize: 2,
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "initial", key: "" });
  const { min, max } = bookingWindow();
  const queryKey = restaurant.id + "|" + fields.date + "|" + fields.partySize;
  const canFetch = isBookingDate(fields.date) &&
    Number.isInteger(fields.partySize) && fields.partySize >= 1 && fields.partySize <= 8;

  useEffect(() => {
    if (!canFetch) return;
    const controller = new AbortController();
    let active = true;
    setAvailability({ status: "loading", key: queryKey });
    getAvailability({
      restaurantId: restaurant.id,
      date: fields.date,
      partySize: fields.partySize,
    }, controller.signal).then(
      (times) => {
        if (!active) return;
        setAvailability(times.length
          ? { status: "success", key: queryKey, times }
          : { status: "empty", key: queryKey });
      },
      (error: unknown) => {
        if (active && (!(error instanceof DOMException) || error.name !== "AbortError")) {
          setAvailability({ status: "error", key: queryKey });
        }
      },
    );
    return () => {
      active = false;
      controller.abort();
    };
  }, [canFetch, restaurant.id, fields.date, fields.partySize, attempt, queryKey]);

  const currentAvailability = availability.key === queryKey && canFetch
    ? availability
    : { status: "initial", key: queryKey } as AvailabilityState;
  const availableTimes = currentAvailability.status === "success" ? currentAvailability.times : [];

  function updateField<K extends ReservationField>(field: K, value: ReservationFields[K]) {
    setFields((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "date" || field === "partySize" ? { time: "" } : {}),
    }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      if (field === "date" || field === "partySize") delete next.time;
      return next;
    });
    setFormMessage("");
    if (field === "date" || field === "partySize") setAttempt(0);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateReservation(fields, availableTimes, itemCount > 0);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFormMessage("Corrigez les champs indiqués pour confirmer votre réservation.");
      const first = fieldOrder.find((field) => nextErrors[field]);
      if (first) {
        window.requestAnimationFrame(() => {
          document.getElementById("reservation-" + first)?.focus();
        });
      }
      return;
    }

    const snapshot = createConfirmationSnapshot(restaurant, dishes, fields);
    if (!saveConfirmation(snapshot, browserConfirmationStorage())) {
      setFormMessage("La réservation n'a pas pu être enregistrée dans cette session. Réessayez.");
      return;
    }
    dispatch({ type: "clear" });
    navigate("/restaurants/" + restaurant.slug + "/confirmation");
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="booking-page page-shell">
        <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/#restaurants">Les tables</Link>
          <span aria-hidden="true">/</span>
          <Link to={"/restaurants/" + restaurant.slug}>{restaurant.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Réservation</span>
        </nav>
        <div className="booking-intro">
          <p className="eyebrow">Votre expérience · {restaurant.name}</p>
          <h1>Choisissez votre moment</h1>
          <p>Votre menu est composé. Trouvons une table, puis gardons vos coordonnées pour la réservation.</p>
        </div>
        <div className="booking-layout">
          <MenuReview restaurant={restaurant} dishes={dishes} itemCount={itemCount} subtotal={subtotal} />
          <form className="booking-form" onSubmit={submit} noValidate>
            <section className="booking-section" aria-labelledby="booking-details-title">
              <div className="booking-section__heading">
                <span aria-hidden="true">01</span>
                <div>
                  <p className="eyebrow">Votre venue</p>
                  <h2 id="booking-details-title">Date & convives</h2>
                </div>
              </div>
              <div className="booking-fields booking-fields--two">
                <div className="booking-field">
                  <label htmlFor="reservation-partySize">Nombre de convives</label>
                  <select
                    id="reservation-partySize"
                    value={fields.partySize}
                    onChange={(event) => updateField("partySize", Number(event.target.value))}
                    aria-invalid={!!errors.partySize}
                    aria-describedby={errors.partySize ? "reservation-partySize-error" : undefined}
                  >
                    {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? "personne" : "personnes"}</option>
                    ))}
                  </select>
                  {errors.partySize && <p className="booking-error" id="reservation-partySize-error">{errors.partySize}</p>}
                </div>
                <div className="booking-field">
                  <label htmlFor="reservation-date">Date de réservation</label>
                  <input
                    id="reservation-date"
                    type="date"
                    min={min}
                    max={max}
                    value={fields.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? "reservation-date-hint reservation-date-error" : "reservation-date-hint"}
                  />
                  <p className="booking-hint" id="reservation-date-hint">Aujourd'hui et les 30 prochains jours.</p>
                  {errors.date && <p className="booking-error" id="reservation-date-error">{errors.date}</p>}
                </div>
              </div>
            </section>
            <section className="booking-section" aria-labelledby="booking-time-title">
              <div className="booking-section__heading">
                <span aria-hidden="true">02</span>
                <div>
                  <p className="eyebrow">À votre rythme</p>
                  <h2 id="booking-time-title">Choisissez une heure</h2>
                </div>
              </div>
              <div className="booking-availability" aria-live="polite" aria-atomic="true">
                {currentAvailability.status === "initial" && (
                  <p id="reservation-time" tabIndex={-1} aria-describedby={errors.time ? "reservation-time-error" : undefined}>Choisissez une date pour voir les créneaux disponibles.</p>
                )}
                {currentAvailability.status === "loading" && (
                  <p id="reservation-time" tabIndex={-1} aria-describedby={errors.time ? "reservation-time-error" : undefined}>Recherche des créneaux disponibles…</p>
                )}
                {currentAvailability.status === "empty" && (
                  <p id="reservation-time" tabIndex={-1} aria-describedby={errors.time ? "reservation-time-error" : undefined}>Aucun créneau pour cette date et ce nombre de convives. Essayez une autre date ou modifiez le nombre de personnes.</p>
                )}
                {currentAvailability.status === "error" && (
                  <div id="reservation-time" tabIndex={-1} aria-describedby={errors.time ? "reservation-time-error" : undefined}>
                    <p>Impossible de récupérer les créneaux pour le moment.</p>
                    <button type="button" className="booking-retry" onClick={() => {
                      setAvailability({ status: "loading", key: queryKey });
                      setAttempt((previous) => previous + 1);
                    }}>Réessayer</button>
                  </div>
                )}
              </div>
              {currentAvailability.status === "success" && (
                <fieldset className="booking-times" aria-describedby={errors.time ? "reservation-time-error" : undefined}>
                  <legend id="reservation-time" tabIndex={-1} aria-describedby={errors.time ? "reservation-time-error" : undefined}>Créneaux disponibles</legend>
                  <div className="booking-times__grid">
                    {availableTimes.map((time) => (
                      <label key={time} className="booking-time">
                        <input
                          type="radio"
                          name="reservation-time"
                          value={time}
                          checked={fields.time === time}
                          onChange={() => updateField("time", time)}
                        />
                        <span>{time}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {errors.time && <p className="booking-error" id="reservation-time-error">{errors.time}</p>}
            </section>
            <section className="booking-section" aria-labelledby="booking-contact-title">
              <div className="booking-section__heading">
                <span aria-hidden="true">03</span>
                <div>
                  <p className="eyebrow">Pour vous retrouver</p>
                  <h2 id="booking-contact-title">Vos coordonnées</h2>
                </div>
              </div>
              <div className="booking-fields booking-fields--two">
                <div className="booking-field">
                  <label htmlFor="reservation-firstName">Prénom</label>
                  <input id="reservation-firstName" type="text" autoComplete="given-name" value={fields.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "reservation-firstName-error" : undefined} />
                  {errors.firstName && <p className="booking-error" id="reservation-firstName-error">{errors.firstName}</p>}
                </div>
                <div className="booking-field">
                  <label htmlFor="reservation-lastName">Nom</label>
                  <input id="reservation-lastName" type="text" autoComplete="family-name" value={fields.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "reservation-lastName-error" : undefined} />
                  {errors.lastName && <p className="booking-error" id="reservation-lastName-error">{errors.lastName}</p>}
                </div>
                <div className="booking-field">
                  <label htmlFor="reservation-email">Adresse e-mail</label>
                  <input id="reservation-email" type="email" autoComplete="email" value={fields.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "reservation-email-error" : undefined} />
                  {errors.email && <p className="booking-error" id="reservation-email-error">{errors.email}</p>}
                </div>
                <div className="booking-field">
                  <label htmlFor="reservation-phone">Téléphone</label>
                  <input id="reservation-phone" type="tel" autoComplete="tel" value={fields.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "reservation-phone-error" : undefined} />
                  {errors.phone && <p className="booking-error" id="reservation-phone-error">{errors.phone}</p>}
                </div>
              </div>
            </section>
            <div className="booking-submit">
              <p>Vous pourrez régler votre menu sur place. Aucun paiement n'est demandé ici.</p>
              {formMessage && <p className="booking-error" role="alert">{formMessage}</p>}
              <button type="submit">Confirmer ma réservation <span aria-hidden="true">↗</span></button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function ReservationPage() {
  const { slug } = useParams();
  const restaurant = slug ? restaurantBySlug(slug) : undefined;
  const { state } = useSelection();

  if (!restaurant) {
    return (
      <SimplePage
        eyebrow="OhMyFood · table introuvable"
        title="Cette table n'existe pas"
        message="Cette adresse ne figure pas dans notre sélection. Découvrez les quatre tables disponibles."
      />
    );
  }

  const summary = summarizeSelection(state, restaurant.id, restaurant.menu);
  if (summary.itemCount === 0) {
    return (
      <>
        <SiteHeader />
        <main id="main-content" className="booking-page booking-page--empty page-shell">
          <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/#restaurants">Les tables</Link>
            <span aria-hidden="true">/</span>
            <Link to={"/restaurants/" + restaurant.slug}>{restaurant.name}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Réservation</span>
          </nav>
          <div className="booking-empty">
            <p className="eyebrow">Votre expérience · {restaurant.name}</p>
            <h1>Composez d'abord votre menu</h1>
            <p>Choisissez au moins un plat chez {restaurant.name} avant de réserver votre table.</p>
            <Link className="primary-link" to={"/restaurants/" + restaurant.slug}>
              Retour à la carte <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return <ReservationExperience restaurant={restaurant} {...summary} />;
}
