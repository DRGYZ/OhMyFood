import type { MenuSection } from "./types";

type DishRow = [name: string, description: string, price: number];

function section(id: string, name: string, rows: DishRow[]): MenuSection {
  return {
    id,
    name,
    items: rows.map(([dishName, description, price], index) => ({
      id: id + "-" + (index + 1),
      name: dishName,
      description,
      price,
    })),
  };
}

// Adapted from the four preserved V1 HTML menus. Prices are illustrative.
export const menus: Record<string, MenuSection[]> = {
  palette: [
    section("palette-entrees", "Entrées", [
      ["Fricassée d'escargots", "Au piment d'Espelette", 25],
      ["Foie gras de canard mi-cuit", "Et ses copeaux de truffe noire", 35],
      ["Œuf au plat", "Assaisonné à la truffe sur lit de caviar", 20],
    ]),
    section("palette-plats", "Plats", [
      ["Filet de bœuf aux herbes", "Accompagné de sa ribambelle de légumes", 40],
      ["Parmentier de queue de bœuf", "À la truffe noire sur sa purée de panais", 35],
      ["Filet de turbot", "Aux agrumes", 44],
    ]),
    section("palette-desserts", "Desserts", [
      ["Paris-Brest", "Revisité", 18],
      ["Macaron au chocolat", "Et glace à la vanille de Madagascar", 22],
      ["Mousse au chocolat", "Au piment d'Espelette et à la truffe noire", 23],
    ]),
  ],
  note: [
    section("note-entrees", "Entrées", [
      ["Tartare de thon", "Assaisonné au yuzu", 25],
      ["Bouchée de homard croustillant", "Et sa farandole de petits légumes", 35],
    ]),
    section("note-plats", "Plats", [
      ["Poulet rôti aux herbes de Provence", "Et sa crème de truffe", 40],
      ["Langouste rôtie", "Et ses légumes de saison", 35],
      ["Côte de bœuf Angus", "Et sa purée de panais", 44],
    ]),
    section("note-desserts", "Desserts", [
      ["Farandole de desserts", "Du chef", 18],
      ["Crème brûlée", "Revisitée", 22],
      ["Tiramisu", "À la noisette", 23],
    ]),
  ],
  francaise: [
    section("francaise-entrees", "Entrées", [
      ["Ravioles de foie gras", "Accompagnées de leur crème à la truffe", 25],
      ["Caviar osciètre", "Sur blini à la farine de blé noir", 35],
      ["Homard et espuma de potiron", "Marinés aux zestes d'orange", 20],
      ["Foie gras de canard cuit entier", "Confiture de figue et pain toasté", 35],
    ]),
    section("francaise-plats", "Plats", [
      ["Noix de coquilles Saint-Jacques", "Sur lit de purée de céleri-rave", 40],
      ["Langoustine poêlée", "Purée de patate douce", 35],
      ["Mijoté de queue de bœuf", "Et riz sauvage aux zestes de citron", 45],
    ]),
    section("francaise-desserts", "Desserts", [
      ["Macaron noisette et chocolat", "Glace au caramel brun et sel de Guérande", 18],
      ["Baba au rhum revisité", "Avec son coulis de citron", 22],
      ["Tarte au citron meringuée", "Déstructurée", 23],
    ]),
  ],
  delice: [
    section("delice-entrees", "Entrées", [
      ["Tartare de poulpe acidulé", "Aux zestes d'orange", 25],
      ["Velouté de légumes d'antan", "Carotte, panais, topinambour", 35],
      ["Soupe à l'oignon", "Revisitée", 20],
    ]),
    section("delice-plats", "Plats", [
      ["Coquilles Saint-Jacques", "Accompagnées d'une purée de panais", 40],
      ["Magret de canard", "Et parmentier de pommes de terre", 35],
      ["Pigeonneau d'Ille-et-Vilaine", "Sur son lit de gnocchis aux légumes", 44],
    ]),
    section("delice-desserts", "Desserts", [
      ["Pétales de violettes glacés", "Et purée de noisettes", 18],
      ["Fondant au chocolat", "Revisité", 22],
      ["Millefeuille croustillant", "Myrtilles et pâte d'amande", 23],
    ]),
  ],
};
