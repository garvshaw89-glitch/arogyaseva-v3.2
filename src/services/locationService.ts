export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  isFallback?: boolean;
}

export const DEFAULT_FALLBACK_LOCATION: UserCoordinates = {
  latitude: 17.6805,
  longitude: 74.0183,
  accuracy: 15,
  timestamp: Date.now(),
  isFallback: true
};

export class LocationService {
  /**
   * Request live user location via Browser Geolocation API
   */
  public static async getCurrentPosition(): Promise<UserCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported by browser. Using fallback coordinates.');
        resolve(DEFAULT_FALLBACK_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            isFallback: false
          });
        },
        (error) => {
          console.warn(`Geolocation error (${error.code}): ${error.message}. Using default location.`);
          resolve(DEFAULT_FALLBACK_LOCATION);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    });
  }

  /**
   * Haversine formula to calculate distance in kilometers between two lat/lng coordinates
   */
  public static calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // 1 decimal place
  }

  private static toRadians(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
