export type TypeRole = {
  role: "Display" | "Heading" | "Body" | "Label";
  font: string;
  weight: number;
  weightLabel?: string;
  size: number;
  leading: number;
  upper: boolean;
  tracking: string;
  sample: string;
};

export type Theme = {
  slug: "utility" | "retrotech" | "storywriter";
  number: string;
  name: string;
  board: string;
  tagline: string;
  numerals?: "roman";
  ticketArt?: "constellation";
  colors: {
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent: string;
    onAccent: string;
    onAccentPress?: string;
    accentHover: string;
    accentPress: string;
    signal: string;
    onSignal: string;
    error: string;
    focus: string;
  };
  uses: Record<"background" | "surface" | "text" | "muted" | "border" | "accent" | "signal" | "error", string>;
  type: TypeRole[];
  spacing: number[];
  radii: { label: string; css: string }[];
  borders: { label: string; css: string }[];
  shadow: { label: string; note: string };
  content: {
    event: { title: string; subs: string[]; date: string; time: string; price: string; no: string };
    rows: { title: string; date: string; price: string }[];
    ticketNote: string;
    inputLabel: string;
    inputPlaceholder: string;
    selectLabel: string;
    selectOptions: string[];
    checkLabel: string;
    radioLabels: [string, string];
    toggleLabel: string;
    tabs: [string, string, string];
    tabPanels: [string, string, string];
    chips: [string, string, string];
    link: string;
    primary: string;
    secondary: string;
    badges: [string, string];
    panelTitle: string;
    states: {
      empty: [string, string];
      loading: [string, string];
      error: [string, string];
      success: [string, string];
    };
  };
};

export const utility: Theme = {
  slug: "utility",
  number: "01",
  name: "Utility",
  board: "Modern Vintage Top Utility",
  tagline: "A watchmaker's bench. Ebony, antique gold and nickel steel, cut with hairlines and held to tight tolerances.",
  numerals: "roman",
  colors: {
    background: "#12100D",
    surface: "#1B1814",
    text: "#EFE8D6",
    muted: "#ABA28F",
    border: "#463D31",
    accent: "#C8A961",
    onAccent: "#12100D",
    accentHover: "#DABD7A",
    accentPress: "#A98B47",
    signal: "#C5CBC7",
    onSignal: "#12100D",
    error: "#D88F8A",
    focus: "#EBDDB0",
  },
  uses: {
    background: "Page. Ebony, like the lining of a case.",
    surface: "Cards, panels, inputs.",
    text: "Everything you read. Warm ivory.",
    muted: "Captions, hints, control outlines.",
    border: "Dividers and card edges.",
    accent: "Antique gold. Primary actions and fine detail.",
    signal: "Nickel steel. On, selected, success.",
    error: "Garnet rose. Faults and warnings.",
  },
  type: [
    { role: "Display", font: "Absans", weight: 400, weightLabel: "Regular", size: 52, leading: 1.1, upper: false, tracking: "-0.01em", sample: "Doors at 8" },
    { role: "Heading", font: "Absans", weight: 400, weightLabel: "Regular", size: 24, leading: 1.25, upper: true, tracking: "0.1em", sample: "Tonight's lineup" },
    { role: "Body", font: "Barlow", weight: 400, size: 16, leading: 1.55, upper: false, tracking: "0", sample: "Cash at the door. All ages. Bring earplugs and a friend." },
    { role: "Label", font: "IBM Plex Mono", weight: 500, size: 12, leading: 1.3, upper: true, tracking: "0.12em", sample: "Serial no. 00417" },
  ],
  spacing: [4, 8, 12, 16, 24, 32, 48],
  radii: [
    { label: "2px instrument", css: "2px" },
    { label: "4px case", css: "4px" },
    { label: "full bezel", css: "999px" },
  ],
  borders: [
    { label: "1px hairline", css: "1px solid var(--border)" },
    { label: "double rule", css: "3px double var(--accent)" },
  ],
  shadow: { label: "Soft lift", note: "A deep, tight shadow under raised parts and a thin highlight on the top edge. Pressed parts sink inward." },
  content: {
    event: { title: "Brass & Bearings", subs: ["Cold Forge", "Tin Whistle"], date: "Sat Nov 8", time: "8:00 PM", price: "$12", no: "00417" },
    rows: [
      { title: "Brass & Bearings", date: "Nov 8", price: "$12" },
      { title: "Lathe & Lacquer Benefit", date: "Nov 15", price: "$10" },
      { title: "Tin Whistle Residency", date: "Nov 22", price: "$8" },
    ],
    ticketNote: "Admit one. No re-entry.",
    inputLabel: "Event title",
    inputPlaceholder: "Brass & Bearings",
    selectLabel: "Sort",
    selectOptions: ["Soonest", "Cheapest", "Newest"],
    checkLabel: "All ages",
    radioLabels: ["General", "Door list"],
    toggleLabel: "Sold-out alert",
    tabs: ["Details", "Lineup", "Door"],
    tabPanels: ["Basement show, load-in at 6. Merch table by the stairs.", "Cold Forge opens at 8, Tin Whistle at 9, Brass & Bearings at 10.", "Cash or card. Door list at the left, tickets at the right."],
    chips: ["All", "Shows", "Benefits"],
    link: "See all shows →",
    primary: "Sell tickets",
    secondary: "Preview",
    badges: ["New", "Sold out"],
    panelTitle: "Ticket details",
    states: {
      empty: ["No tickets yet", "Add an event to print your first ticket."],
      loading: ["Engraving ticket…", "This takes a second."],
      error: ["Couldn't engrave", "The barcode failed. Try again."],
      success: ["Ticket ready", "Link copied to clipboard."],
    },
  },
};

export const retrotech: Theme = {
  slug: "retrotech",
  number: "02",
  name: "Retrotech",
  board: "Red and Teal Retrotech Dystopia",
  tagline: "A dead channel at 3 a.m. Black screens, one red warning light, thin lines that glow teal when touched.",
  colors: {
    background: "#0B0C0D",
    surface: "#252D30",
    text: "#E9E4D8",
    muted: "#8AABAD",
    border: "#3B4B4E",
    accent: "#F51111",
    onAccent: "#0B0C0D",
    onAccentPress: "#FFFFFF",
    accentHover: "#FF3B30",
    accentPress: "#C40E0E",
    signal: "#3FC8BC",
    onSignal: "#0B0C0D",
    error: "#FFB347",
    focus: "#9FF2EA",
  },
  uses: {
    background: "Page. Near-black, a screen with the lights off.",
    surface: "Cards, panels, inputs.",
    text: "Everything you read. Warm phosphor white.",
    muted: "Captions, hints, control outlines.",
    border: "Dividers and card edges.",
    accent: "Warning red. Primary actions only. Turns light-on-dark when pressed.",
    signal: "Teal. Links, selected, on, success.",
    error: "Amber fault light. Errors only.",
  },
  type: [
    { role: "Display", font: "Airstrike", weight: 400, weightLabel: "Bold", size: 52, leading: 1.05, upper: true, tracking: "0.02em", sample: "Signal lost" },
    { role: "Heading", font: "Airstrike", weight: 400, weightLabel: "Bold", size: 26, leading: 1.15, upper: true, tracking: "0.05em", sample: "Tonight's broadcast" },
    { role: "Body", font: "Space Mono", weight: 400, size: 15, leading: 1.6, upper: false, tracking: "0", sample: "Warehouse show. The address is sent after you buy." },
    { role: "Label", font: "Chakra Petch", weight: 600, size: 12, leading: 1.3, upper: true, tracking: "0.16em", sample: "Ch 03 / live" },
  ],
  spacing: [2, 4, 8, 12, 16, 24, 32],
  radii: [
    { label: "0 panel", css: "0px" },
    { label: "2px key", css: "2px" },
    { label: "full lamp", css: "999px" },
  ],
  borders: [
    { label: "1px line", css: "1px solid var(--border)" },
    { label: "1px + glow", css: "1px solid var(--signal)" },
  ],
  shadow: { label: "Glow", note: "No drop shadow. Hover and focus light the edge with a soft teal or red glow." },
  content: {
    event: { title: "Signal Lost", subs: ["Static Prayer", "VHS Saints"], date: "Fri Dec 12", time: "9:30 PM", price: "$15", no: "03-7781" },
    rows: [
      { title: "Signal Lost", date: "Dec 12", price: "$15" },
      { title: "Dead Channel Night", date: "Dec 19", price: "$12" },
      { title: "Tape Ghost Showcase", date: "Dec 27", price: "$10" },
    ],
    ticketNote: "Valid for one entry. Do not duplicate.",
    inputLabel: "Event title",
    inputPlaceholder: "Signal Lost",
    selectLabel: "Sort",
    selectOptions: ["Soonest", "Cheapest", "Newest"],
    checkLabel: "All ages",
    radioLabels: ["General", "Door list"],
    toggleLabel: "Sold-out alert",
    tabs: ["Details", "Lineup", "Door"],
    tabPanels: ["Warehouse, second floor. Load-in at 7. Earplugs at the bar.", "Static Prayer at 9:30, VHS Saints at 10:30, Signal Lost at 11:30.", "Card only. Show the code at the steel door."],
    chips: ["All", "Shows", "Benefits"],
    link: "See all shows →",
    primary: "Sell tickets",
    secondary: "Preview",
    badges: ["Live", "Sold out"],
    panelTitle: "Ticket details",
    states: {
      empty: ["No tickets found", "Add an event to print your first ticket."],
      loading: ["Printing ticket…", "Stand by."],
      error: ["Print fault", "The barcode failed. Try again."],
      success: ["Ticket printed", "Link copied to clipboard."],
    },
  },
};

export const storywriter: Theme = {
  slug: "storywriter",
  number: "03",
  name: "Storywriter",
  board: "Your Future, You Storywriter",
  tagline: "Dark slate, ivory type and gold leaf. Monumental, quiet and exact, with a score pressed into the dark.",
  ticketArt: "constellation",
  colors: {
    background: "#15191D",
    surface: "#1F252B",
    text: "#F2ECDA",
    muted: "#AEB1AA",
    border: "#3A434C",
    accent: "#D3AE5B",
    onAccent: "#15191D",
    accentHover: "#E3C57A",
    accentPress: "#B08F45",
    signal: "#A8873C",
    onSignal: "#15191D",
    error: "#E58A68",
    focus: "#E8CB7D",
  },
  uses: {
    background: "Page. Dark slate.",
    surface: "Cards, panels, inputs. Lifted slate.",
    text: "Everything you read. Ivory.",
    muted: "Captions, hints, control outlines. Stone.",
    border: "Dividers and panel edges.",
    accent: "Gold leaf. Primary actions and fine rules.",
    signal: "Patina gold. Selected, on, success.",
    error: "Copper. Errors only.",
  },
  type: [
    { role: "Display", font: "Cal Sans", weight: 400, weightLabel: "Regular", size: 52, leading: 1.05, upper: true, tracking: "0.02em", sample: "Dry season" },
    { role: "Heading", font: "Cal Sans", weight: 400, weightLabel: "Regular", size: 26, leading: 1.2, upper: true, tracking: "0.04em", sample: "Tonight's lineup" },
    { role: "Body", font: "DM Mono", weight: 400, size: 15, leading: 1.65, upper: false, tracking: "0", sample: "A concrete room, one long wall of speakers and no stage." },
    { role: "Label", font: "Josefin Sans", weight: 600, size: 12, leading: 1.3, upper: true, tracking: "0.14em", sample: "No. 0042" },
  ],
  spacing: [6, 12, 18, 24, 36, 48, 72],
  radii: [
    { label: "0 monolith", css: "0px" },
    { label: "2px edge", css: "2px" },
    { label: "full pebble", css: "999px" },
  ],
  borders: [
    { label: "1px hairline", css: "1px solid var(--border)" },
    { label: "2px gold rule", css: "2px solid var(--accent)" },
  ],
  shadow: { label: "Glow", note: "No drop shadows. A soft gold-leaf glow marks focus and hover. Everything else is flat slate." },
  content: {
    event: { title: "Dry Season", subs: ["Low Orbit", "Hollow Ground"], date: "Sun Nov 16", time: "7:00 PM", price: "$10", no: "0042" },
    rows: [
      { title: "Dry Season", date: "Nov 16", price: "$10" },
      { title: "Low Orbit, Live", date: "Nov 23", price: "$8" },
      { title: "Hollow Ground Session", date: "Nov 30", price: "$6" },
    ],
    ticketNote: "Valid for one entry.",
    inputLabel: "Event title",
    inputPlaceholder: "Dry Season",
    selectLabel: "Sort",
    selectOptions: ["Soonest", "Cheapest", "Newest"],
    checkLabel: "All ages",
    radioLabels: ["General", "Door list"],
    toggleLabel: "Sold-out alert",
    tabs: ["Details", "Lineup", "Door"],
    tabPanels: ["Concrete room, doors at 6:30. Water at the back.", "Low Orbit at 7, Hollow Ground at 8, Dry Season at 9.", "Cash or card. Tickets are checked at the desk."],
    chips: ["All", "Shows", "Sessions"],
    link: "See all shows →",
    primary: "Sell tickets",
    secondary: "Preview",
    badges: ["New", "Sold out"],
    panelTitle: "Ticket details",
    states: {
      empty: ["No tickets yet", "Add an event to print your first ticket."],
      loading: ["Printing ticket…", "One moment."],
      error: ["Print error", "The barcode failed. Try again."],
      success: ["Ticket ready", "Link copied to clipboard."],
    },
  },
};

export const themes = { utility, retrotech, storywriter };
