// departmnt.xyz is not live yet. Until it is, V2 links to the preview build,
// which is why V2 stays local and is not deployed. At launch, switch this to
// "https://departmnt.xyz" and V2 can ship.
export const DEPARTMNT_SITE = "https://departmnt-labs.vercel.app";

export const departmntWorkUrl = (labsSlug: string) => `${DEPARTMNT_SITE}/work/${labsSlug}`;

export const TAPTECH_PARTS = [
  { name: "Tags", line: "Ten formats, in products, places and on people." },
  { name: "Portal", line: "The page a tap opens. No app, ever." },
  { name: "Core", line: "Where you run it, and keep the record." },
];

export const STATUS_LABEL = { live: "Live", ended: "Ended", opening: "Opening" } as const;
