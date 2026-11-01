// departmnt.xyz is the source of truth for DEPARTMNT case studies, figures and product wording.
export const DEPARTMNT_SITE = "https://departmnt.xyz";

export const departmntWorkUrl = (labsSlug: string) => `${DEPARTMNT_SITE}/work/${labsSlug}`;

export const TAPTECH_PARTS = [
  { name: "Tags", line: "People tap to engage. Tags come in customisable formats." },
  { name: "Portal", line: "A space for your people, enter via tap. No app install required." },
  { name: "Core", line: "Organise, measure and activate everything from one place." },
];

export const STATUS_LABEL = { live: "Live", completed: "Completed", opening: "Opening" } as const;
