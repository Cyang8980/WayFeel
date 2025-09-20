export const MARKER_VIEW_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Personal', value: 'personal' },
  { label: 'Anon', value: 'anon' },
] as const;

export type MarkerViewType = typeof MARKER_VIEW_OPTIONS[number]['value'];

// Preserving exact original sizes
export const LAYOUT_SIZES = {
  CALENDAR_HEIGHT_RATIO: 0.25,
  MAP_HEIGHT_RATIO: 0.65,
  MIN_CALENDAR_HEIGHT: 250,
  MIN_MAP_HEIGHT: 400,
  CALENDAR_WIDTH_LG: 'w-1/3',
  CALENDAR_WIDTH_XL: 'w-1/4',
  MAP_WIDTH_LG: 'w-2/3',
  MAP_WIDTH_XL: 'w-3/4',
} as const;

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 8,
  DEFAULT_CENTER: { lat: 37.7749, lng: -122.4194 },
} as const;
