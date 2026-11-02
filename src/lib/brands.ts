import { departmntWorkUrl } from "./departmnt";

// Client marks in /images/logos. The files are white marks on transparent backgrounds, so on the
// light page they're filtered to solid ink. Boiler Room's is a filled black disc and is shown as is.
export interface Logo {
  file: string;
  name: string;
  /** Width over height of the file, used to size marks so they look equally weighted. */
  ratio: number;
  /** Leave the file's own colours alone instead of filtering it to ink. */
  asIs?: boolean;
}

const logo = (id: string, name: string, ratio: number, asIs = false): Logo => ({
  file: `/images/logos/${id}.png`,
  name,
  ratio,
  asIs,
});

export const LOGOS = {
  crocsKasina: logo("bqSpvsAFrdiCphSWU5uPtwaVbw", "Kasina × Crocs", 6.52),
  hlls: logo("FjrV6A6BMgIskLefRyIyKKghyk", "H.LLS", 6.92),
  mulaa: logo("y96VKNNaIjlQE3bFRtU3N8Hc4", "Mulaa Joans", 3.69),
  atlantic: logo("Wr0gyvkynQO6OB9JGga4qfdrV0", "Atlantic Records", 1.0),
  you: logo("zJqyT4D83X29dP9syrdfPsOdfzo", "YOU Studio", 2.71),
  gshock: logo("AUEHB6WEWqPGdQCUOCZs3Kw2cJs", "G-SHOCK", 6.16),
  navinder: logo("yuF8Glfc9MYdKuectWW9bWH02Dg", "Navinder Nangla", 0.95),
  genesys: logo("E21lJiPj6h90n7vTYyeyZSiZ0Y", "Genesys", 1.54),
  mercedes: logo("T8uAOScR0xkvP4hhxllTYf1ZPI4", "Mercedes-Benz", 0.96),
  abinbev: logo("R2myBgMMbe0q7niUKEh9od3Zdw", "AB InBev", 3.08),
  o2: logo("SW3j5FpP9H6YKwpbJv505JfMwHA", "O2", 1.15),
  reebok: logo("VGysfM7eIhu9bvbn1d7vVmqqs1I", "Reebok", 1.99),
  warner: logo("rfiZuSlNifP1XA00obYNVBpbTUE", "Warner Music UK", 1.0),
  boilerRoom: logo("AvKlIpwI4O2Ws5lHYtL7BWaSY", "Boiler Room", 1.0, true),
} satisfies Record<string, Logo>;

/** The logo wall, in reading order. Fourteen marks fill a 7 × 2 grid exactly. */
export const LOGO_WALL: Logo[] = [
  LOGOS.crocsKasina,
  LOGOS.gshock,
  LOGOS.mercedes,
  LOGOS.atlantic,
  LOGOS.warner,
  LOGOS.boilerRoom,
  LOGOS.o2,
  LOGOS.abinbev,
  LOGOS.reebok,
  LOGOS.hlls,
  LOGOS.genesys,
  LOGOS.mulaa,
  LOGOS.navinder,
  LOGOS.you,
];

/** Mark shown on each DEPARTMNT project card, keyed by work entry id. */
export const WORK_LOGO: Record<string, Logo> = {
  "crocs-kasina": LOGOS.crocsKasina,
  "hlls-10k-projects": LOGOS.hlls,
  "mulaa-joans-atlantic": LOGOS.mulaa,
  "you-studio": LOGOS.you,
  "g-shock-who-eats-art": LOGOS.gshock,
  "navinder-nangla": LOGOS.navinder,
  genesys: LOGOS.genesys,
};

// Client films. Shown at their own shape (portrait or landscape) rather than cropped.
export interface Film {
  src: string;
  poster: string;
  width: number;
  height: number;
  logo: Logo;
  title: string;
  href: string;
}

const film = (id: string, poster: string, w: number, h: number, l: Logo, title: string, labsSlug: string): Film => ({
  src: `/videos/partners/${id}.mp4`,
  poster,
  width: w,
  height: h,
  logo: l,
  title,
  href: departmntWorkUrl(labsSlug),
});

export const CLIENT_FILMS: Film[] = [
  film("FCXfnqK5mg3OLagHvnz8bTwiFVU", "/videos/partners/FCXfnqK5mg3OLagHvnz8bTwiFVU.webp", 540, 960, LOGOS.crocsKasina, "Kasina × Crocs", "kasina-crocs"),
  film("tEJyLiw78Otl9HT31lSl71Igd1Q", "/videos/partners/tEJyLiw78Otl9HT31lSl71Igd1Q.webp", 960, 540, LOGOS.hlls, "H.LLS × 10K Projects", "hlls"),
  film("Wx86FMdjp6N48XUOZVyO07ZCsE", "/videos/partners/Wx86FMdjp6N48XUOZVyO07ZCsE.webp", 540, 960, LOGOS.gshock, "G-SHOCK × Who Eats Art", "who-eats-art-gshock"),
  film("5olowgzf0BM9OmmN6A4xMDB6k", "/videos/partners/5olowgzf0BM9OmmN6A4xMDB6k.webp", 960, 540, LOGOS.navinder, "Navinder Nangla × END.", "navinder-nangla"),
  film("zwjFGabSp2mAmVuDqPu2ZZBOOc", "/videos/partners/zwjFGabSp2mAmVuDqPu2ZZBOOc.webp", 540, 960, LOGOS.genesys, "Genesys", "genesys"),
];
