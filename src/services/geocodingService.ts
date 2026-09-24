export interface AddressSuggestion {
  placeId: string;
  displayName: string;
  shortName: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

export class GeocodingService {
  private static debounceTimer: any = null;

  /**
   * Search addresses and places in India using OpenStreetMap Nominatim API
   */
  public static async searchAddress(query: string): Promise<AddressSuggestion[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        query.trim()
      )}&countrycodes=in&limit=6`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'ArogyaSeva-Healthcare-Platform/1.0'
        }
      });

      if (!response.ok) return [];
      const data = await response.json();

      return data.map((item: any, idx: number) => {
        const addr = item.address || {};
        const villageName =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.village ||
          addr.town ||
          addr.city_district ||
          item.display_name.split(',')[0];

        const districtName = addr.state_district || addr.county || addr.city || 'District Area';
        const stateName = addr.state || 'India';

        return {
          placeId: `${item.place_id || idx}`,
          displayName: item.display_name,
          shortName: `${villageName}, ${districtName}`,
          village: villageName,
          district: districtName,
          state: stateName,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        };
      });
    } catch (err) {
      console.warn('Geocoding search API error:', err);
      return [];
    }
  }
}
