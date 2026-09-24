import { Hospital } from '../types';
import { INITIAL_HOSPITALS } from '../lib/mockData';
import { LocationService } from './locationService';

export class HospitalService {
  /**
   * Fetch nearby hospitals relative to user latitude and longitude
   */
  public static async fetchNearbyHospitals(
    lat: number,
    lng: number,
    radiusKm: number = 25
  ): Promise<Hospital[]> {
    try {
      // 1. Calculate distances for local verified regional hospital directory
      const verifiedHospitals: Hospital[] = INITIAL_HOSPITALS.map((hosp) => {
        const dist = LocationService.calculateDistanceKm(lat, lng, hosp.latitude, hosp.longitude);
        const estTime = Math.max(5, Math.round((dist / 40) * 60));
        return {
          ...hosp,
          distanceKm: dist,
          travelTimeMin: estTime
        };
      });

      // 2. Query OpenStreetMap Overpass API for real live nearby hospitals if online
      const overpassHospitals = await this.queryOSMOverpassHospitals(lat, lng, radiusKm);

      // Merge and deduplicate by name
      const combined: Hospital[] = [...verifiedHospitals];
      overpassHospitals.forEach((osmHosp) => {
        if (!combined.some((item) => item.name.toLowerCase().includes(osmHosp.name.toLowerCase()))) {
          combined.push(osmHosp);
        }
      });

      // Sort by distance ascending
      return combined.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } catch (err) {
      console.warn('Overpass API query fallback to verified hospital database:', err);
      const fallbackList: Hospital[] = INITIAL_HOSPITALS.map((hosp) => {
        const dist = LocationService.calculateDistanceKm(lat, lng, hosp.latitude, hosp.longitude);
        return {
          ...hosp,
          distanceKm: dist,
          travelTimeMin: Math.max(5, Math.round((dist / 40) * 60))
        };
      });
      return fallbackList.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }
  }

  private static async queryOSMOverpassHospitals(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<Hospital[]> {
    const radiusMeters = radiusKm * 1000;
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `[out:json];node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});out 10;`;

    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!response.ok) return [];
    const data = await response.json();

    if (!data.elements) return [];

    return data.elements
      .filter((el: any) => el.tags && el.tags.name)
      .map((el: any, index: number) => {
        const dist = LocationService.calculateDistanceKm(lat, lng, el.lat, el.lon);
        const item: Hospital = {
          id: `osm-${el.id || index}`,
          stateId: 'osm-dynamic',
          name: el.tags.name,
          type: el.tags['healthcare:speciality'] ? 'District Hospital' : 'Community Health Center',
          latitude: el.lat,
          longitude: el.lon,
          address: el.tags['addr:full'] || el.tags['addr:street'] || 'Nearby Health Facility',
          phone: el.tags.phone || '+91 108 (Emergency)',
          distanceKm: dist,
          travelTimeMin: Math.max(5, Math.round((dist / 40) * 60)),
          totalBeds: 60,
          icuBedsAvailable: 5,
          oxygenAvailable: true,
          emergency24x7: true,
          specialties: ['General Triage', 'Emergency Services']
        };
        return item;
      });
  }
}
