import { useState } from "react";
import { Link, useParams } from "react-router";
import { SiteHeader } from "../discover/components/SiteHeader";
import {
  cuisineLabel,
  dietaryLabel,
  restaurantBySlug,
  type Restaurant,
} from "../discover/restaurants";
import { useSelection } from "../selection/SelectionContext";
import { summarizeSelection } from "../selection/selection";
import { SimplePage } from "../SimplePage";
import type { MenuItem, MenuSection as MenuSectionData } from "./types";

const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <article className={"menu-item" + (quantity ? " menu-item--selected" : "")}>
      <div className="menu-item__copy">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div className="menu-item__controls">
        <span className="menu-item__price">{euro.format(item.price)}</span>
        {quantity === 0 ? (
          <button
            type="button"
            className="menu-item__add"
            onClick={onAdd}
            aria-label={"Ajouter " + item.name + " à la sélection"}
          >
            <span aria-hidden="true">+</span>
            <span>Ajouter</span>
          </button>
        ) : (
          <div className="quantity-control" role="group" aria-label={"Quantité de " + item.name}>
            <button
              type="button"
              onClick={onRemove}
              aria-label={"Diminuer la quantité de " + item.name}
            >
              <span aria-hidden="true">−</span>
            </button>
            <output aria-live="off" aria-label={"Quantité actuelle : " + quantity}>
              {quantity}
            </output>
            <button
              type="button"
              onClick={onAdd}
              aria-label={"Augmenter la quantité de " + item.name}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

interface MenuSectionProps {
  section: MenuSectionData;
  quantities: Record<string, number>;
  onChange: (item: MenuItem, action: "add" | "remove") => void;
}

function MenuSection({ section, quantities, onChange }: MenuSectionProps) {
  return (
    <section className="menu-section" aria-labelledby={section.id}>
      <div className="menu-section__heading">
        <div>
          <p className="eyebrow">La carte</p>
          <h2 id={section.id}>{section.name}</h2>
        </div>
        <span>{String(section.items.length).padStart(2, "0")} créations</span>
      </div>
      {section.description && <p>{section.description}</p>}
      <div className="menu-section__items">
        {section.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            quantity={quantities[item.id] ?? 0}
            onAdd={() => onChange(item, "add")}
            onRemove={() => onChange(item, "remove")}
          />
        ))}
      </div>
    </section>
  );
}

function SelectionSummary({ restaurant, onClear }: { restaurant: Restaurant; onClear: () => void }) {
  const { state } = useSelection();
  const { dishes, itemCount, subtotal } = summarizeSelection(
    state,
    restaurant.id,
    restaurant.menu,
  );

  return (
    <>
      <aside className="selection-panel" aria-labelledby="selection-heading">
        <p className="eyebrow">Votre moment à table</p>
        <h2 id="selection-heading">Votre sélection</h2>
        <p className="selection-panel__intro">
          Composez votre repas à partir de la carte de {restaurant.name}.
        </p>
        {dishes.length === 0 ? (
          <p className="selection-panel__empty">
            Aucun plat sélectionné. Parcourez la carte et ajoutez ce qui vous tente.
          </p>
        ) : (
          <ul className="selection-panel__list">
            {dishes.map(({ item, quantity, lineTotal }) => (
              <li key={item.id}>
                <span><strong>{quantity} ×</strong> {item.name}</span>
                <span>{euro.format(lineTotal)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="selection-panel__total">
          <span>Sous-total · {itemCount} {itemCount === 1 ? "plat" : "plats"}</span>
          <strong>{euro.format(subtotal)}</strong>
        </div>
        {itemCount > 0 ? (
          <Link className="selection-panel__continue" to="/reservation">
            Préparer ma réservation <span aria-hidden="true">↗</span>
          </Link>
        ) : (
          <span className="selection-panel__hint">Ajoutez un plat pour continuer</span>
        )}
        {itemCount > 0 && (
          <button
            type="button"
            className="selection-panel__clear"
            onClick={onClear}
          >
            Effacer la sélection
          </button>
        )}
        <p className="selection-panel__footnote">
          Prix indicatifs issus de la carte V1 · aucune commande n'est envoyée.
        </p>
      </aside>
      {itemCount > 0 && (
        <div className="selection-mobile">
          <div>
            <strong>{itemCount} {itemCount === 1 ? "plat" : "plats"}</strong>
            <span>{euro.format(subtotal)}</span>
          </div>
          <Link to="/reservation" aria-label={"Voir ma sélection : " + itemCount + " " + (itemCount === 1 ? "plat" : "plats") + ", " + euro.format(subtotal)}>
            Continuer <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </>
  );
}

export function RestaurantPage() {
  const { slug } = useParams();
  const restaurant = slug ? restaurantBySlug(slug) : undefined;
  const { state, dispatch } = useSelection();
  const [announcement, setAnnouncement] = useState("");

  if (!restaurant) {
    return (
      <SimplePage
        eyebrow="OhMyFood · table introuvable"
        title="Cette table n'existe pas"
        message="Cette adresse ne figure pas dans notre sélection. Découvrez les quatre tables disponibles."
      />
    );
  }

  const quantities = state.restaurantId === restaurant.id ? state.quantities : {};

  function changeItem(item: MenuItem, action: "add" | "remove") {
    dispatch({ type: action, restaurantId: restaurant!.id, itemId: item.id });
    setAnnouncement(
      action === "add"
        ? item.name + " ajouté à votre sélection."
        : item.name + " retiré de votre sélection.",
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="restaurant-page">
        <div className="page-shell">
          <nav className="restaurant-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/#restaurants">Les tables</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{restaurant.name}</span>
          </nav>
          <div className="restaurant-hero">
            <div className="restaurant-hero__photo">
              <img
                src={restaurant.image.src}
                alt={restaurant.image.alt}
                width={restaurant.image.width}
                height={restaurant.image.height}
                fetchPriority="high"
              />
            </div>
            <div className="restaurant-hero__content">
              <p className="eyebrow">Une table de Paris · {restaurant.area}</p>
              <h1>{restaurant.name}</h1>
              <p className="restaurant-hero__description">{restaurant.description}</p>
              <div className="restaurant-hero__facts">
                <span>{cuisineLabel(restaurant.cuisine)}</span>
                <span>Paris {restaurant.neighborhood}</span>
                <span aria-label={"Gamme de prix indicative, " + restaurant.priceLevel + " symboles euro"}>
                  {"€".repeat(restaurant.priceLevel)}
                </span>
                <span>{restaurant.serviceNote}</span>
              </div>
              {restaurant.dietaryOptions.length > 0 && (
                <p className="restaurant-hero__dietary">
                  {restaurant.dietaryOptions.map(dietaryLabel).join(" · ")}
                </p>
              )}
            </div>
          </div>
          <div className="restaurant-layout">
            <div className="restaurant-menu">
              <div className="restaurant-menu__intro">
                <p className="eyebrow">Composez votre repas</p>
                <h2>La carte</h2>
                <p>Des plats issus de la carte originale, à sélectionner à votre rythme.</p>
              </div>
              {restaurant.menu.map((section) => (
                <MenuSection
                  key={section.id}
                  section={section}
                  quantities={quantities}
                  onChange={changeItem}
                />
              ))}
            </div>
            <SelectionSummary
              restaurant={restaurant}
              onClear={() => {
                dispatch({ type: "clear" });
                setAnnouncement("Sélection effacée.");
              }}
            />
          </div>
          <p className="visually-hidden" role="status" aria-live="polite">
            {announcement}
          </p>
        </div>
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner page-shell">
          <span className="site-footer__brand">OhMyFood</span>
          <p>Quatre tables parisiennes à explorer.</p>
          <p>Prototype de portfolio · informations illustratives</p>
        </div>
      </footer>
    </>
  );
}
