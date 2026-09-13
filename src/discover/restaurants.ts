import paletteImage from "../assets/restaurants/palette.jpg";
import noteImage from "../assets/restaurants/note.jpg";
import francaiseImage from "../assets/restaurants/francaise.jpg";
import deliceImage from "../assets/restaurants/delice.png";

export const cuisineOptions = [
  { value: "bistronomie", label: "Bistronomie" },
  { value: "creative", label: "Cuisine créative" },
  { value: "francaise", label: "Cuisine française" },
] as const;

export const neighborhoodOptions = [
  { value: "10e", label: "Paris 10e" },
  { value: "11e", label: "Paris 11e" },
  { value: "20e", label: "Paris 20e" },
] as const;

export const dietaryOptions = [
  { value: "vegetarien", label: "Options végétariennes" },
  { value: "sans-gluten", label: "Options sans gluten" },
] as const;

export type Cuisine = (typeof cuisineOptions)[number]["value"];
export type Neighborhood = (typeof neighborhoodOptions)[number]["value"];
export type DietaryOption = (typeof dietaryOptions)[number]["value"];

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  neighborhood: Neighborhood;
  area: string;
  cuisine: Cuisine;
  description: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  priceLevel: 2 | 3;
  dietaryOptions: DietaryOption[];
  serviceNote: string;
  featured: boolean;
}

export const restaurants: Restaurant[] = [
  {
    id: "palette",
    slug: "la-palette-du-gout",
    name: "La palette du goût",
    neighborhood: "11e",
    area: "Bastille",
    cuisine: "bistronomie",
    description:
      "Une table de quartier pour s'attarder autour d'une cuisine généreuse et de saison.",
    image: {
      src: paletteImage,
      alt: "Assiette dressée sur une table de restaurant avec verres et lumière du soir",
      width: 1200,
      height: 800,
    },
    priceLevel: 2,
    dietaryOptions: ["vegetarien"],
    serviceNote: "Service du soir",
    featured: true,
  },
  {
    id: "note",
    slug: "la-note-enchantee",
    name: "La note enchantée",
    neighborhood: "11e",
    area: "République",
    cuisine: "creative",
    description:
      "Des assiettes inventives et une salle où le repas prend son temps.",
    image: {
      src: noteImage,
      alt: "Plusieurs assiettes colorées vues du dessus sur une table sombre",
      width: 900,
      height: 1125,
    },
    priceLevel: 3,
    dietaryOptions: ["vegetarien"],
    serviceNote: "Midi & soir",
    featured: false,
  },
  {
    id: "francaise",
    slug: "a-la-francaise",
    name: "À la française",
    neighborhood: "10e",
    area: "Canal Saint-Martin",
    cuisine: "francaise",
    description:
      "Une adresse chaleureuse pour retrouver les plaisirs d'une cuisine française actuelle.",
    image: {
      src: francaiseImage,
      alt: "Œufs pochés et légumes servis dans une assiette blanche",
      width: 1200,
      height: 800,
    },
    priceLevel: 2,
    dietaryOptions: [],
    serviceNote: "Déjeuner",
    featured: false,
  },
  {
    id: "delice",
    slug: "le-delice-des-sens",
    name: "Le délice des sens",
    neighborhood: "20e",
    area: "Belleville",
    cuisine: "bistronomie",
    description:
      "Une cuisine vive et soignée, pensée pour les curieux du 20e.",
    image: {
      src: deliceImage,
      alt: "Plat de poisson présenté dans une assiette rectangulaire",
      width: 340,
      height: 174,
    },
    priceLevel: 3,
    dietaryOptions: ["sans-gluten"],
    serviceNote: "Midi & soir",
    featured: false,
  },
];

export const cuisineLabel = (value: Cuisine) =>
  cuisineOptions.find((option) => option.value === value)?.label ?? value;

export const dietaryLabel = (value: DietaryOption) =>
  dietaryOptions.find((option) => option.value === value)?.label ?? value;

export const restaurantBySlug = (slug: string) =>
  restaurants.find((restaurant) => restaurant.slug === slug);
