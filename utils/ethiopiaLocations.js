// Simplified Ethiopian administrative hierarchy: Region -> Zone -> a few sample Woredas.
// This is intentionally a starter dataset, not exhaustive — extend freely with your
// actual coverage areas. Kebele is left as free text since there are thousands of them.
export const ETHIOPIA_LOCATIONS = {
  'Addis Ababa': {
    zones: {
      'Addis Ababa': ['Bole', 'Kirkos', 'Yeka', 'Arada', 'Lideta', 'Kolfe Keranio'],
    },
  },
  Oromia: {
    zones: {
      'East Shewa': ['Adama', 'Bishoftu', 'Mojo'],
      'West Shewa': ['Ambo', 'Bako', 'Gedo'],
      Jimma: ['Jimma Town', 'Agaro', 'Limmu Kosa'],
    },
  },
  Amhara: {
    zones: {
      'North Gondar': ['Gondar Zuria', 'Debark', 'Dabat'],
      'South Wollo': ['Dessie Zuria', 'Kombolcha', 'Kutaber'],
      'East Gojjam': ['Debre Markos', 'Motta', 'Bibugn'],
    },
  },
  Tigray: {
    zones: {
      'Central Tigray': ['Axum', 'Adwa', 'Laelay Maychew'],
      'Eastern Tigray': ['Adigrat', 'Ganta Afeshum'],
    },
  },
  Sidama: {
    zones: {
      Hawassa: ['Hawassa Zuria', 'Tabor', 'Bensa'],
    },
  },
  SNNPR: {
    zones: {
      Gurage: ['Wolkite', 'Cheha', 'Ezha'],
      Wolayita: ['Sodo Zuria', 'Boditi', 'Areka'],
    },
  },
  Somali: {
    zones: {
      Jarar: ['Degehabur', 'Gunagado'],
      Fafan: ['Jijiga', 'Kebribeyah'],
    },
  },
  'Dire Dawa': {
    zones: {
      'Dire Dawa': ['Dire Dawa Town'],
    },
  },
};

export const REGIONS = Object.keys(ETHIOPIA_LOCATIONS);

export function getZones(region) {
  return region ? Object.keys(ETHIOPIA_LOCATIONS[region]?.zones || {}) : [];
}

export function getWoredas(region, zone) {
  return region && zone ? ETHIOPIA_LOCATIONS[region]?.zones?.[zone] || [] : [];
}