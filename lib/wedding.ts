export const wedding = {
  bride: "Zayra",
  groom: "Gabriel",
  initials: "G&Z",
  date: new Date("2026-07-25T17:00:00"),
  dateLabel: "Veinticinco de Julio",
  dateShort: "25.07.2026",
  city: "Ciudad de México",
  ceremony: {
    title: "Ceremonia",
    time: "17:00",
    place: "Parroquia de San Agustín",
    address: "Av. Insurgentes Sur 1234, Roma Norte",
    mapsQuery: "Parroquia San Agustin Roma Norte CDMX",
  },
  reception: {
    title: "Recepción",
    time: "19:30",
    place: "Hacienda Los Laureles",
    address: "Camino Real 88, Tepoztlán",
    mapsQuery: "Hacienda Los Laureles Tepoztlan",
  },
  dressCode: "Formal · Tonos tierra",
  dressCodePalette: [
    { name: "Café tabaco", hex: "#3a2a1e" },
    { name: "Vino", hex: "#7c1d1d" },
    { name: "Oro viejo", hex: "#c9a961" },
    { name: "Marfil", hex: "#f5ecd9" },
    { name: "Salvia", hex: "#5b6f4a" },
  ],
  dressCodeNotes: {
    ellas: "Vestido largo o midi en tonos tierra · evitar blanco",
    ellos: "Traje oscuro · corbata o moño en tonos cálidos",
  },
  story:
    "Nos cruzamos siendo niños, sin imaginar que Dios ya tejía nuestra historia. Nos permitió crecer y recorrer caminos separados para prepararnos, y nos volvió a unir en el momento perfecto. Hoy iniciamos una nueva etapa con la certeza de que caminar juntos le da sentido a todo.",
  rsvpDeadline: "1 de Julio",
  gallery: [
    { caption: "El primer viaje", year: "2022" },
    { caption: "Año nuevo en Oaxaca", year: "2023" },
    { caption: "Domingo de feria", year: "2023" },
    { caption: "La propuesta", year: "2025" },
    { caption: "Sesión de compromiso", year: "2026" },
    { caption: "Camino al altar", year: "2026" },
  ],
  godparents: [
    { role: "Padrinos de velación", names: "Roberto Domínguez & María Ruiz" },
    { role: "Padrinos de anillos", names: "Juan Hernández & Ana Sosa" },
    { role: "Padrinos de arras", names: "Luis Pérez & Carmen López" },
    { role: "Padrinos de lazo", names: "Andrés Mejía & Sofía Vázquez" },
  ],
  gifts: [
    {
      store: "Amazon",
      code: "Mesa #482910",
      url: "https://www.amazon.com.mx/wedding/",
      accent: "#ff9900",
    },
    {
      store: "Liverpool",
      code: "Evento #71204",
      url: "https://mesaderegalos.liverpool.com.mx/",
      accent: "#e60023",
    },
    {
      store: "Sears",
      code: "Mesa #38842",
      url: "https://mesaderegalos.sears.com.mx/",
      accent: "#0072ce",
    },
  ],
  music: {
    title: "All I want is you",
    artist: "U2",
    src: "/music/our-song.mp3",
  },
  hashtag: "#GabrielYZayra2026",
} as const;

export type Wedding = typeof wedding;
