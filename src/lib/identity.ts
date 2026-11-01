// Who Gareth is, in the form search engines read (schema.org JSON-LD).
// Stable @ids let every page, and departmnt.xyz, point at the same entities.
export const SITE = "https://www.garethmatthews.uk";
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;
export const ORG_ID = "https://departmnt.xyz/#organization";

export const PROFILES = [
  "https://www.linkedin.com/in/gareth-matthews/",
  "https://instagram.com/iammrgm",
  "https://x.com/iammrgm",
  "https://iammrgm.substack.com/",
];

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Gareth Matthews",
  givenName: "Gareth",
  familyName: "Matthews",
  jobTitle: "Founder & CEO",
  description:
    "Founder and CEO of DEPARTMNT, the company behind TapTech. 15+ years across culture and commerce: clubs, artist management and global brand programmes.",
  url: `${SITE}/`,
  image: {
    "@type": "ImageObject",
    url: `${SITE}/press/gareth-matthews-headshot.jpg`,
    width: 1200,
    height: 1500,
  },
  address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  worksFor: { "@id": ORG_ID },
  sameAs: PROFILES,
  knowsAbout: [
    "NFC",
    "TapTech",
    "Connected products",
    "Fan infrastructure",
    "Ticketing",
    "Brand activation",
    "Live events",
    "Artist management",
  ],
};

export const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "DEPARTMNT",
  legalName: "DEPARTMNT LABS UK LTD",
  url: "https://departmnt.xyz/",
  foundingDate: "2021",
  identifier: { "@type": "PropertyValue", propertyID: "Companies House", value: "16465558" },
  founder: [{ "@id": PERSON_ID }, { "@type": "Person", name: "Kadeem Henry" }],
  sameAs: [
    "https://www.instagram.com/departmnt_hq/",
    "https://x.com/departmnt_hq",
    "https://www.linkedin.com/company/departmnt-hq/",
  ],
};

export const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: "Gareth Matthews",
  inLanguage: "en-GB",
  publisher: { "@id": PERSON_ID },
};

export function pageGraph(opts: { url: string; title: string; description: string; profile: boolean }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      organization,
      website,
      {
        "@type": opts.profile ? "ProfilePage" : "WebPage",
        "@id": `${opts.url}#webpage`,
        url: opts.url,
        name: opts.title,
        description: opts.description,
        inLanguage: "en-GB",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        ...(opts.profile && { mainEntity: { "@id": PERSON_ID } }),
      },
    ],
  };
}
