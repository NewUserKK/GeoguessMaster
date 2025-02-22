export type SelectboxOption = {
  text: string;
  value: string;
};

export type GameHistory = {
  randomLatLng: google.maps.LatLng;
  selectedLatLng: google.maps.LatLng;
};

export type Summary = {
  playerName: string;
  score: number;
};

export type DistanceByPlayer = {
  playerName: string;
  distance: number;
}

export type LatLngPropType = google.maps.LatLng | null;
