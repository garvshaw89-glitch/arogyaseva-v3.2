export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array for Leaflet map polyline
  distanceKm: number;
  durationMin: number;
  steps: {
    instruction: string;
    distanceMeters: number;
  }[];
  googleMapsUrl: string;
  wazeUrl: string;
}

export class RoutingService {
  /**
   * Calculate real driving route from Origin [lat, lng] to Destination [lat, lng] via OSRM API
   */
  public static async calculateRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): Promise<RouteResult> {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
    const wazeUrl = `https://waze.com/ul?ll=${destLat},${destLng}&navigate=yes`;

    try {
      // OSRM expects coordinates in lng,lat format
      const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('OSRM API returned status ' + res.status);

      const data = await res.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route returned from OSRM');
      }

      const route = data.routes[0];
      const coordinates: [number, number][] = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] // convert [lng, lat] -> [lat, lng]
      );

      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMin = Math.round(route.duration / 60);

      const steps = (route.legs[0]?.steps || []).map((step: any) => ({
        instruction: step.maneuver ? `${step.maneuver.type} ${step.name || ''}`.trim() : 'Proceed along route',
        distanceMeters: Math.round(step.distance)
      }));

      return {
        coordinates,
        distanceKm,
        durationMin,
        steps,
        googleMapsUrl,
        wazeUrl
      };
    } catch (err) {
      console.warn('OSRM routing fallback to straight polyline:', err);
      // Fallback straight polyline
      const distanceKm = this.haversine(originLat, originLng, destLat, destLng);
      return {
        coordinates: [
          [originLat, originLng],
          [destLat, destLng]
        ],
        distanceKm,
        durationMin: Math.max(5, Math.round((distanceKm / 40) * 60)),
        steps: [
          { instruction: 'Head directly towards destination hospital', distanceMeters: Math.round(distanceKm * 1000) }
        ],
        googleMapsUrl,
        wazeUrl
      };
    }
  }

  private static haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  }
}
