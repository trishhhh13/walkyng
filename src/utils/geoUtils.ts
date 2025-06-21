// geoUtils.ts

import { PermissionsAndroid, Platform } from "react-native";

/**
 * Converts degrees to radians
 * @param value - value in degrees
 */
export const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Calculates the distance between two coordinates using the Haversine formula
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns Distance in kilometers
 */
export const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Formats duration in seconds to HH:mm:ss string
 * @param seconds
 * @returns formatted string
 */
export const formatDuration = (seconds: number): string => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};