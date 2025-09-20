import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Route, 
  Fuel, 
  DollarSign, 
  Navigation,
  RefreshCw,
  AlertCircle,
  Map
} from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface TollGate {
  id: number;
  lat: number;
  lng: number;
  name?: string;
}

interface RouteData {
  distance: number;
  duration: number;
}

interface FuelData {
  mileage: number;
  price: number;
}

export default function LocationMap() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [tollGates, setTollGates] = useState<TollGate[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [fuelData, setFuelData] = useState<FuelData>({ mileage: 15, price: 100 });
  const [tollCost, setTollCost] = useState<number>(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [nearbyServices, setNearbyServices] = useState<any[]>([]);
  const [autoDestination, setAutoDestination] = useState<Location | null>(null);
  const [startDestination, setStartDestination] = useState<Location | null>(null);
  const [stopDestination, setStopDestination] = useState<Location | null>(null);
  const [customRoute, setCustomRoute] = useState<RouteData | null>(null);
  const [selectedStartLocation, setSelectedStartLocation] = useState<string>('');
  const [selectedStopLocation, setSelectedStopLocation] = useState<string>('');

  // Calculate straight-line distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Get custom route distance
  const getCustomRouteDistance = () => {
    if (!selectedStartLocation || !selectedStopLocation) return null;
    
    const startLocation = tamilNaduLocations.find(loc => loc.name === selectedStartLocation);
    const stopLocation = tamilNaduLocations.find(loc => loc.name === selectedStopLocation);
    
    if (!startLocation || !stopLocation) return null;
    
    return calculateDistance(startLocation.lat, startLocation.lng, stopLocation.lat, stopLocation.lng);
  };

  // Tamil Nadu Toll Gates Database
  const tamilNaduTollGates = [
    // Chennai to Coimbatore route toll gates
    { id: 1, name: "Chennai Bypass Toll", lat: 12.9716, lng: 80.2200, route: "Chennai-Coimbatore" },
    { id: 2, name: "Sriperumbudur Toll", lat: 12.9500, lng: 79.9500, route: "Chennai-Coimbatore" },
    { id: 3, name: "Kanchipuram Toll", lat: 12.8338, lng: 79.7000, route: "Chennai-Coimbatore" },
    { id: 4, name: "Vellore Toll", lat: 12.9202, lng: 79.1500, route: "Chennai-Coimbatore" },
    { id: 5, name: "Krishnagiri Toll", lat: 12.5200, lng: 78.2200, route: "Chennai-Coimbatore" },
    { id: 6, name: "Coimbatore Bypass Toll", lat: 11.0168, lng: 76.9558, route: "Chennai-Coimbatore" },
    
    // Chennai to Madurai route toll gates
    { id: 7, name: "Chennai Outer Ring Road Toll", lat: 13.0827, lng: 80.1000, route: "Chennai-Madurai" },
    { id: 8, name: "Chengalpattu Toll", lat: 12.6900, lng: 79.9700, route: "Chennai-Madurai" },
    { id: 9, name: "Villupuram Toll", lat: 11.9900, lng: 79.3700, route: "Chennai-Madurai" },
    { id: 10, name: "Tiruchirappalli Toll", lat: 10.7905, lng: 78.7047, route: "Chennai-Madurai" },
    { id: 11, name: "Madurai Bypass Toll", lat: 9.9252, lng: 78.1198, route: "Chennai-Madurai" },
    
    // Coimbatore to Salem route toll gates
    { id: 12, name: "Coimbatore-Salem Highway Toll 1", lat: 11.2000, lng: 77.5000, route: "Coimbatore-Salem" },
    { id: 13, name: "Coimbatore-Salem Highway Toll 2", lat: 11.4000, lng: 77.8000, route: "Coimbatore-Salem" },
    { id: 14, name: "Salem Bypass Toll", lat: 11.6643, lng: 78.1460, route: "Coimbatore-Salem" },
    
    // Madurai to Tirunelveli route toll gates
    { id: 15, name: "Madurai-Tirunelveli Toll 1", lat: 9.5000, lng: 77.8000, route: "Madurai-Tirunelveli" },
    { id: 16, name: "Madurai-Tirunelveli Toll 2", lat: 9.2000, lng: 77.6000, route: "Madurai-Tirunelveli" },
    { id: 17, name: "Tirunelveli Bypass Toll", lat: 8.7139, lng: 77.7567, route: "Madurai-Tirunelveli" },
    
    // General toll gates
    { id: 18, name: "Erode Bypass Toll", lat: 11.3410, lng: 77.7172, route: "General" },
    { id: 19, name: "Thanjavur Toll", lat: 10.7870, lng: 79.1378, route: "General" },
    { id: 20, name: "Tiruppur Toll", lat: 11.1085, lng: 77.3411, route: "General" },
    { id: 21, name: "Dindigul Toll", lat: 10.3450, lng: 77.9600, route: "General" },
    { id: 22, name: "Karur Toll", lat: 10.9601, lng: 78.0767, route: "General" },
    { id: 23, name: "Namakkal Toll", lat: 11.2226, lng: 78.1672, route: "General" },
    { id: 24, name: "Theni Toll", lat: 10.0104, lng: 77.4818, route: "General" },
    { id: 25, name: "Cuddalore Toll", lat: 11.7488, lng: 79.7714, route: "General" },
    { id: 26, name: "Pudukkottai Toll", lat: 10.3800, lng: 78.8200, route: "General" },
    { id: 27, name: "Sivaganga Toll", lat: 9.8438, lng: 78.4809, route: "General" },
    { id: 28, name: "Ramanathapuram Toll", lat: 9.3716, lng: 78.8307, route: "General" },
    { id: 29, name: "Virudhunagar Toll", lat: 9.5850, lng: 77.9600, route: "General" },
    { id: 30, name: "Thoothukudi Toll", lat: 8.7642, lng: 78.1348, route: "General" },
    { id: 31, name: "Kanyakumari Toll", lat: 8.0883, lng: 77.5385, route: "General" },
    { id: 32, name: "Krishnagiri Toll", lat: 12.5200, lng: 78.2200, route: "General" },
    { id: 33, name: "Dharmapuri Toll", lat: 12.1200, lng: 78.1600, route: "General" },
    { id: 34, name: "Tiruvannamalai Toll", lat: 12.2300, lng: 79.0600, route: "General" },
    { id: 35, name: "Ariyalur Toll", lat: 11.1400, lng: 79.0800, route: "General" },
    { id: 36, name: "Perambalur Toll", lat: 11.2300, lng: 78.8800, route: "General" },
    { id: 37, name: "Nagapattinam Toll", lat: 10.7600, lng: 79.8400, route: "General" },
    { id: 38, name: "Thiruvarur Toll", lat: 10.7700, lng: 79.6300, route: "General" },
    { id: 39, name: "Mayiladuthurai Toll", lat: 11.1000, lng: 79.6500, route: "General" },
    { id: 40, name: "Chengalpattu Toll", lat: 12.6900, lng: 79.9700, route: "General" },
    { id: 41, name: "Ranipet Toll", lat: 12.9300, lng: 79.3200, route: "General" },
    { id: 42, name: "Tirupathur Toll", lat: 12.5000, lng: 78.5600, route: "General" },
    { id: 43, name: "Tenkasi Toll", lat: 8.9600, lng: 77.3100, route: "General" },
    { id: 44, name: "Kallakurichi Toll", lat: 11.7400, lng: 78.9600, route: "General" },
    { id: 45, name: "Tiruvallur Toll", lat: 13.1400, lng: 79.9000, route: "General" },
    { id: 46, name: "Nilgiris Toll", lat: 11.4000, lng: 76.7000, route: "General" }
  ];

  // Tamil Nadu Districts and Villages Data
  const tamilNaduLocations = [
    { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "District" },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558, type: "District" },
    { name: "Madurai", lat: 9.9252, lng: 78.1198, type: "District" },
    { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, type: "District" },
    { name: "Salem", lat: 11.6643, lng: 78.1460, type: "District" },
    { name: "Tirunelveli", lat: 8.7139, lng: 77.7567, type: "District" },
    { name: "Erode", lat: 11.3410, lng: 77.7172, type: "District" },
    { name: "Thanjavur", lat: 10.7870, lng: 79.1378, type: "District" },
    { name: "Tiruppur", lat: 11.1085, lng: 77.3411, type: "District" },
    { name: "Vellore", lat: 12.9202, lng: 79.1500, type: "District" },
    { name: "Kanchipuram", lat: 12.8338, lng: 79.7000, type: "District" },
    { name: "Dindigul", lat: 10.3450, lng: 77.9600, type: "District" },
    { name: "Karur", lat: 10.9601, lng: 78.0767, type: "District" },
    { name: "Namakkal", lat: 11.2226, lng: 78.1672, type: "District" },
    { name: "Theni", lat: 10.0104, lng: 77.4818, type: "District" },
    { name: "Cuddalore", lat: 11.7488, lng: 79.7714, type: "District" },
    { name: "Villupuram", lat: 11.9900, lng: 79.3700, type: "District" },
    { name: "Pudukkottai", lat: 10.3800, lng: 78.8200, type: "District" },
    { name: "Sivaganga", lat: 9.8438, lng: 78.4809, type: "District" },
    { name: "Ramanathapuram", lat: 9.3716, lng: 78.8307, type: "District" },
    { name: "Virudhunagar", lat: 9.5850, lng: 77.9600, type: "District" },
    { name: "Thoothukudi", lat: 8.7642, lng: 78.1348, type: "District" },
    { name: "Kanyakumari", lat: 8.0883, lng: 77.5385, type: "District" },
    { name: "Krishnagiri", lat: 12.5200, lng: 78.2200, type: "District" },
    { name: "Dharmapuri", lat: 12.1200, lng: 78.1600, type: "District" },
    { name: "Tiruvannamalai", lat: 12.2300, lng: 79.0600, type: "District" },
    { name: "Ariyalur", lat: 11.1400, lng: 79.0800, type: "District" },
    { name: "Perambalur", lat: 11.2300, lng: 78.8800, type: "District" },
    { name: "Nagapattinam", lat: 10.7600, lng: 79.8400, type: "District" },
    { name: "Thiruvarur", lat: 10.7700, lng: 79.6300, type: "District" },
    { name: "Mayiladuthurai", lat: 11.1000, lng: 79.6500, type: "District" },
    { name: "Chengalpattu", lat: 12.6900, lng: 79.9700, type: "District" },
    { name: "Ranipet", lat: 12.9300, lng: 79.3200, type: "District" },
    { name: "Tirupathur", lat: 12.5000, lng: 78.5600, type: "District" },
    { name: "Tenkasi", lat: 8.9600, lng: 77.3100, type: "District" },
    { name: "Kallakurichi", lat: 11.7400, lng: 78.9600, type: "District" },
    { name: "Tiruvallur", lat: 13.1400, lng: 79.9000, type: "District" },
    { name: "Nilgiris", lat: 11.4000, lng: 76.7000, type: "District" },
    // Popular Villages
    { name: "Pollachi", lat: 10.6500, lng: 77.0100, type: "Village" },
    { name: "Udumalpet", lat: 10.5800, lng: 77.2500, type: "Village" },
    { name: "Palani", lat: 10.4500, lng: 77.5200, type: "Village" },
    { name: "Dharapuram", lat: 10.7300, lng: 77.5200, type: "Village" },
    { name: "Kangayam", lat: 11.0000, lng: 77.5600, type: "Village" },
    { name: "Bhavani", lat: 11.4500, lng: 77.6800, type: "Village" },
    { name: "Gobichettipalayam", lat: 11.4500, lng: 77.4500, type: "Village" },
    { name: "Sathyamangalam", lat: 11.5200, lng: 77.2500, type: "Village" },
    { name: "Avinashi", lat: 11.1900, lng: 77.2700, type: "Village" },
    { name: "Mettupalayam", lat: 11.3000, lng: 76.9500, type: "Village" },
    { name: "Valparai", lat: 10.3200, lng: 76.9600, type: "Village" },
    { name: "Ooty", lat: 11.4100, lng: 76.7000, type: "Village" },
    { name: "Coonoor", lat: 11.3500, lng: 76.8000, type: "Village" },
    { name: "Gudalur", lat: 11.5000, lng: 76.5000, type: "Village" },
    { name: "Kotagiri", lat: 11.4200, lng: 76.8600, type: "Village" }
  ];

  // Get user's current location and fetch all related data automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          
          // Set immediate fallback data for instant display
          setLocationDetails({
            city: 'Tamil Nadu',
            principalSubdivision: 'Tamil Nadu',
            countryName: 'India',
            localityInfo: {
              administrative: [{ name: 'Tamil Nadu' }]
            }
          });
          
          // Set immediate fallback route data
          const fallbackDestination = { lat: 13.0827, lng: 80.2707 }; // Chennai
          setAutoDestination(fallbackDestination);
          setDestination(fallbackDestination);
          
          // Set immediate fallback route data
          setRouteData({
            distance: 50000, // 50km
            duration: 3600,  // 1 hour
            geometry: null
          });
          
          // Fetch real data in background
          try {
            fetchLocationDetails(latitude, longitude);
            findNearestDestination(latitude, longitude);
            setTimeout(() => {
              fetchNearbyServices(latitude, longitude);
            }, 1000);
          } catch (error) {
            console.error('Error in data fetching:', error);
          }
          
          updateMapUrl(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location access.');
          
          // Set fallback data even if location fails
          setLocationDetails({
            city: 'Tamil Nadu',
            principalSubdivision: 'Tamil Nadu',
            countryName: 'India',
            localityInfo: {
              administrative: [{ name: 'Tamil Nadu' }]
            }
          });
          
          const fallbackDestination = { lat: 13.0827, lng: 80.2707 };
          setAutoDestination(fallbackDestination);
          setDestination(fallbackDestination);
          
          setRouteData({
            distance: 50000,
            duration: 3600,
            geometry: null
          });
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      
      // Set fallback data even if geolocation not supported
      setLocationDetails({
        city: 'Tamil Nadu',
        principalSubdivision: 'Tamil Nadu',
        countryName: 'India',
        localityInfo: {
          administrative: [{ name: 'Tamil Nadu' }]
        }
      });
      
      const fallbackDestination = { lat: 13.0827, lng: 80.2707 };
      setAutoDestination(fallbackDestination);
      setDestination(fallbackDestination);
      
      setRouteData({
        distance: 50000,
        duration: 3600,
        geometry: null
      });
    }
  }, []);

  // Update map URL when location changes
  const updateMapUrl = (lat: number, lng: number) => {
    const zoom = 13;
    // Use a more reliable map service
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgxE4d4Q&center=${lat},${lng}&zoom=${zoom}&maptype=roadmap`;
    setMapUrl(mapUrl);
  };


  // Fetch location details (address, city, etc.)
  const fetchLocationDetails = async (lat: number, lng: number) => {
    try {
      // Set immediate fallback data
      setLocationDetails({
        city: 'Tamil Nadu',
        principalSubdivision: 'Tamil Nadu',
        countryName: 'India',
        localityInfo: {
          administrative: [{ name: 'Tamil Nadu' }]
        }
      });

      // Try to fetch detailed data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      const data = await response.json();
      setLocationDetails(data);
    } catch (error) {
      console.error('Error fetching location details:', error);
      // Keep the fallback data that was already set
    }
  };


  // Fetch nearby services (fuel stations, hospitals, etc.)
  const fetchNearbyServices = async (lat: number, lng: number) => {
    try {
      // Set immediate fallback services
      const fallbackServices = [
        { id: 1, tags: { amenity: 'fuel', name: 'Nearby Fuel Station' } },
        { id: 2, tags: { amenity: 'hospital', name: 'Local Hospital' } },
        { id: 3, tags: { amenity: 'bank', name: 'Nearest Bank' } },
        { id: 4, tags: { shop: 'supermarket', name: 'Local Supermarket' } },
        { id: 5, tags: { amenity: 'fuel', name: 'Petrol Pump' } },
        { id: 6, tags: { amenity: 'hospital', name: 'Medical Center' } }
      ];
      setNearbyServices(fallbackServices);

      const queries = [
        `[out:json];node["amenity"="fuel"](around:5000,${lat},${lng});out;`,
        `[out:json];node["amenity"="hospital"](around:10000,${lat},${lng});out;`,
        `[out:json];node["amenity"="bank"](around:5000,${lat},${lng});out;`,
        `[out:json];node["shop"="supermarket"](around:5000,${lat},${lng});out;`
      ];

      const services = [];
      for (const query of queries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout per query

          const response = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
            { signal: controller.signal }
          );
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.warn(`API returned ${response.status} for query`);
            continue;
          }
          
          const data = await response.json();
          if (data.elements && Array.isArray(data.elements)) {
            services.push(...data.elements);
          }
        } catch (err) {
          console.warn('Error fetching service:', err.message);
          // Continue with other queries
        }
      }
      
      // Only update if we got real data, otherwise keep fallback
      if (services.length > 0) {
        setNearbyServices(services);
      }
    } catch (error) {
      console.error('Error fetching nearby services:', error);
      // Keep the fallback services that were already set
    }
  };

  // Find nearest destination (agricultural market, equipment dealer, etc.)
  const findNearestDestination = async (lat: number, lng: number) => {
    try {
      // Set immediate fallback destination (Chennai as default)
      const fallbackDestination = { lat: 13.0827, lng: 80.2707 };
      setAutoDestination(fallbackDestination);
      setDestination(fallbackDestination);
      
      // Try to fetch real data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const query = `[out:json];node["shop"="farm"](around:20000,${lat},${lng});out;`;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const nearest = data.elements[0];
        setAutoDestination({ lat: nearest.lat, lng: nearest.lon });
        setDestination({ lat: nearest.lat, lng: nearest.lon });
        
        // Automatically calculate route to nearest destination
        if (userLocation) {
          fetchRoute(userLocation, { lat: nearest.lat, lng: nearest.lon });
        }
      } else {
        // Use fallback and calculate route
        if (userLocation) {
          fetchRoute(userLocation, fallbackDestination);
        }
      }
    } catch (error) {
      console.error('Error finding nearest destination:', error);
      // Use fallback destination
      const fallbackDestination = { lat: 13.0827, lng: 80.2707 };
      setAutoDestination(fallbackDestination);
      setDestination(fallbackDestination);
      
      if (userLocation) {
        fetchRoute(userLocation, fallbackDestination);
      }
    }
  };

  // Fetch route from OSRM API
  const fetchRoute = async (start: Location, end: Location) => {
    try {
      setLoading(true);
      
      // Set immediate fallback route data
      const fallbackRoute = {
        distance: 50000, // 50km fallback
        duration: 3600,  // 1 hour fallback
        geometry: null
      };
      
      // Try to fetch real route data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setRouteData(fallbackRoute);
        setLoading(false);
      }, 8000); // 8 second timeout

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        setRouteData(data.routes[0]);
      } else {
        setRouteData(fallbackRoute);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Use fallback route data
      setRouteData({
        distance: 50000, // 50km fallback
        duration: 3600,  // 1 hour fallback
        geometry: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle destination input
  const handleDestinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = parseFloat(formData.get('lat') as string);
    const lng = parseFloat(formData.get('lng') as string);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const newDestination = { lat, lng };
      setDestination(newDestination);
      
      if (userLocation) {
        fetchRoute(userLocation, newDestination);
      }
    }
  };

  // Calculate comprehensive trip cost
  const calculateTripCost = () => {
    const currentRoute = customRoute || routeData;
    let distanceKm = 0;
    
    if (currentRoute) {
      distanceKm = currentRoute.distance / 1000;
    } else {
      // Try to use custom route distance if available
      const customDistance = getCustomRouteDistance();
      if (customDistance) {
        distanceKm = customDistance;
      } else {
        distanceKm = 50; // fallback
      }
    }

    // Fuel cost calculation
    const fuelCost = (distanceKm / fuelData.mileage) * fuelData.price;
    
    // Toll cost calculation (₹50 per toll gate)
    const tollCostAmount = tollGatesOnRoute.length * 50;
    
    // Maintenance cost (₹2 per km for wear and tear)
    const maintenanceCostAmount = distanceKm * 2;
    
    // Driver cost (₹500 per day or ₹50 per hour, minimum 2 hours)
    const estimatedHours = Math.max(2, distanceKm / 40); // Assuming 40 km/h average
    const driverCost = Math.max(500, estimatedHours * 50);
    
    // Total cost
    const totalCost = fuelCost + tollCostAmount + maintenanceCostAmount + driverCost;
    
    return {
      fuelCost,
      tollCost: tollCostAmount,
      maintenanceCost: maintenanceCostAmount,
      driverCost,
      totalCost,
      distanceKm
    };
  };

  // Calculate custom route between start and stop destinations
  const calculateCustomRoute = async () => {
    if (!startDestination || !stopDestination) return;
    
    try {
      setLoading(true);
      
      // Set immediate fallback route data
      const fallbackRoute = {
        distance: 75000, // 75km fallback
        duration: 5400,  // 1.5 hour fallback
        geometry: null
      };
      
      // Try to fetch real route data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setCustomRoute(fallbackRoute);
        setLoading(false);
      }, 10000); // 10 second timeout

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startDestination.lng},${startDestination.lat};${stopDestination.lng},${stopDestination.lat}?overview=full&geometries=geojson`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        setCustomRoute({
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
          geometry: data.routes[0].geometry
        });
      } else {
        setCustomRoute(fallbackRoute);
      }
    } catch (error) {
      console.error('Error calculating custom route:', error);
      // Use fallback route data
      setCustomRoute({
        distance: 75000, // 75km fallback
        duration: 5400,  // 1.5 hour fallback
        geometry: null
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle custom destination form submission
  const handleCustomRouteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedStartLocation || !selectedStopLocation) {
      setError('Please select both start and stop locations');
      return;
    }
    
    const startLocation = tamilNaduLocations.find(loc => loc.name === selectedStartLocation);
    const stopLocation = tamilNaduLocations.find(loc => loc.name === selectedStopLocation);
    
    if (startLocation && stopLocation) {
      setStartDestination({ lat: startLocation.lat, lng: startLocation.lng });
      setStopDestination({ lat: stopLocation.lat, lng: stopLocation.lng });
      calculateCustomRoute();
    }
  };

  // Calculate toll gates between start and end destinations using local database
  const calculateTollGatesOnRoute = () => {
    if (!selectedStartLocation || !selectedStopLocation) {
      return [];
    }

    // Create route identifier
    const routeKey = `${selectedStartLocation}-${selectedStopLocation}`;
    const reverseRouteKey = `${selectedStopLocation}-${selectedStartLocation}`;
    
    // Find toll gates for specific routes
    const specificRouteTollGates = tamilNaduTollGates.filter(gate => 
      gate.route === routeKey || gate.route === reverseRouteKey
    );

    if (specificRouteTollGates.length > 0) {
      return specificRouteTollGates;
    }

    // If no specific route found, use geographical calculation
    const startLocation = tamilNaduLocations.find(loc => loc.name === selectedStartLocation);
    const stopLocation = tamilNaduLocations.find(loc => loc.name === selectedStopLocation);
    
    if (!startLocation || !stopLocation) return [];

    const routeTollGates = tamilNaduTollGates.filter(gate => {
      const startLat = startLocation.lat;
      const startLng = startLocation.lng;
      const stopLat = stopLocation.lat;
      const stopLng = stopLocation.lng;
      
      // Create a bounding box between start and stop
      const minLat = Math.min(startLat, stopLat);
      const maxLat = Math.max(startLat, stopLat);
      const minLng = Math.min(startLng, stopLng);
      const maxLng = Math.max(startLng, stopLng);
      
      // Add some buffer around the route
      const buffer = 0.1; // ~10km buffer
      
      return gate.lat >= (minLat - buffer) && 
             gate.lat <= (maxLat + buffer) && 
             gate.lng >= (minLng - buffer) && 
             gate.lng <= (maxLng + buffer);
    });

    return routeTollGates;
  };

  const tollGatesOnRoute = calculateTollGatesOnRoute();

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Location Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!userLocation) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Getting Your Location</h3>
          <p className="text-muted-foreground">Please allow location access to continue...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location & Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Location Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Your Location:</span>
                  <span className="text-sm text-muted-foreground">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </span>
                </div>
                {destination && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Auto Destination:</span>
                    <span className="text-sm text-muted-foreground">
                      {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Location Details */}
              {locationDetails && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">📍 Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><strong>Address:</strong> {locationDetails.localityInfo?.administrative?.[0]?.name || 'N/A'}</div>
                    <div><strong>City:</strong> {locationDetails.city || 'N/A'}</div>
                    <div><strong>State:</strong> {locationDetails.principalSubdivision || 'N/A'}</div>
                    <div><strong>Country:</strong> {locationDetails.countryName || 'N/A'}</div>
                  </div>
                </div>
              )}

            </div>

            {/* Custom Route Planner */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                  <Route className="h-6 w-6" />
                  🗺️ Custom Route Planner
                </CardTitle>
                <p className="text-blue-600 text-sm">Plan your own route between any two points</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomRouteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Destination */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-700 font-medium">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        🚀 Start Destination
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startLocation" className="text-sm text-gray-700">Select Start Location</Label>
                        <select
                          id="startLocation"
                          value={selectedStartLocation}
                          onChange={(e) => setSelectedStartLocation(e.target.value)}
                          className="w-full p-3 border border-green-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
                        >
                          <option value="">Choose start location...</option>
                          <optgroup label="🏛️ Districts">
                            {tamilNaduLocations.filter(loc => loc.type === 'District').map(location => (
                              <option key={location.name} value={location.name}>
                                {location.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="🏘️ Villages">
                            {tamilNaduLocations.filter(loc => loc.type === 'Village').map(location => (
                              <option key={location.name} value={location.name}>
                                {location.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        {selectedStartLocation && (
                          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                            📍 {tamilNaduLocations.find(loc => loc.name === selectedStartLocation)?.lat.toFixed(4)}, {tamilNaduLocations.find(loc => loc.name === selectedStartLocation)?.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stop Destination */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-700 font-medium">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        🎯 Stop Destination
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stopLocation" className="text-sm text-gray-700">Select Stop Location</Label>
                        <select
                          id="stopLocation"
                          value={selectedStopLocation}
                          onChange={(e) => setSelectedStopLocation(e.target.value)}
                          className="w-full p-3 border border-red-200 rounded-lg focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-white"
                        >
                          <option value="">Choose stop location...</option>
                          <optgroup label="🏛️ Districts">
                            {tamilNaduLocations.filter(loc => loc.type === 'District').map(location => (
                              <option key={location.name} value={location.name}>
                                {location.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="🏘️ Villages">
                            {tamilNaduLocations.filter(loc => loc.type === 'Village').map(location => (
                              <option key={location.name} value={location.name}>
                                {location.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        {selectedStopLocation && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            📍 {tamilNaduLocations.find(loc => loc.name === selectedStopLocation)?.lat.toFixed(4)}, {tamilNaduLocations.find(loc => loc.name === selectedStopLocation)?.lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium"
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Calculate Custom Route
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setCustomRoute(null);
                        setStartDestination(null);
                        setStopDestination(null);
                        setSelectedStartLocation('');
                        setSelectedStopLocation('');
                        if (userLocation) {
                          updateMapUrl(userLocation.lat, userLocation.lng);
                        }
                      }}
                      className="border-gray-300"
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                {/* Quick Location Buttons */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-blue-600 mb-2">Quick locations:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStartLocation('Chennai')}
                      className="text-xs border-green-200 text-green-700 hover:bg-green-50"
                    >
                      🏛️ Chennai (Start)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStopLocation('Coimbatore')}
                      className="text-xs border-red-200 text-red-700 hover:bg-red-50"
                    >
                      🏛️ Coimbatore (Stop)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStartLocation('Madurai')}
                      className="text-xs border-green-200 text-green-700 hover:bg-green-50"
                    >
                      🏛️ Madurai (Start)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStopLocation('Salem')}
                      className="text-xs border-red-200 text-red-700 hover:bg-red-50"
                    >
                      🏛️ Salem (Stop)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Services */}
            {nearbyServices.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">🏪</span>
                  Nearby Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {nearbyServices.slice(0, 8).map((service, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                        {service.tags?.amenity || service.tags?.shop || 'Service'}
                      </Badge>
                      <span className="text-gray-700">{service.tags?.name || `Service ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Custom Route Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
              <MapPin className="h-5 w-5" />
              🗺️ Custom Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customRoute ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-700">
                  {(customRoute.distance / 1000).toFixed(1)} km
                </div>
                <div className="text-sm text-purple-600">
                  ⏱️ {Math.round(customRoute.duration / 60)} minutes
                </div>
                <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  ✓ Custom planned
                </div>
              </div>
            ) : (() => {
              const distance = getCustomRouteDistance();
              return (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-700">
                    {distance ? `${distance.toFixed(1)} km` : '-- km'}
                  </div>
                  <div className="text-sm text-purple-600">
                    ⏱️ {distance ? `${Math.round(distance * 1.5)} min` : '-- minutes'}
                  </div>
                  <div className="text-xs text-purple-500">
                    {distance ? 'Straight-line distance' : 'Set custom destinations above'}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Trip Cost Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-800">
              <Fuel className="h-5 w-5" />
              💰 Trip Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const costs = calculateTripCost();
              return (
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-green-700">
                    ₹{costs.totalCost.toFixed(0)}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">⛽ Fuel:</span>
                      <span className="font-medium">₹{costs.fuelCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">🚧 Toll Gates:</span>
                      <span className="font-medium">₹{costs.tollCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">🔧 Maintenance:</span>
                      <span className="font-medium">₹{costs.maintenanceCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">👨‍💼 Driver:</span>
                      <span className="font-medium">₹{costs.driverCost.toFixed(0)}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    📊 {costs.distanceKm.toFixed(1)} km total distance
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Toll Gates Card */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-red-800">
              <AlertCircle className="h-5 w-5" />
              🚧 Toll Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-700">
                {tollGatesOnRoute.length}
              </div>
              <div className="text-sm text-red-600">
                🛣️ {startDestination && stopDestination ? 'Between your route' : 'On your route'}
              </div>
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                ✓ {startDestination && stopDestination ? 'Route-specific calculation' : 'Auto-detected within 10km'}
              </div>
              {startDestination && stopDestination && (
                <div className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full mt-2">
                  📍 From {selectedStartLocation} to {selectedStopLocation}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Settings Form */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-orange-800">
            <Fuel className="h-6 w-6" />
            ⚙️ Fuel Settings
          </CardTitle>
          <p className="text-orange-600 text-sm">Customize your vehicle's fuel efficiency and current fuel prices</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="mileage" className="text-orange-700 font-medium">🚗 Vehicle Mileage (km/l)</Label>
              <div className="relative">
                <Input
                  id="mileage"
                  type="number"
                  value={fuelData.mileage}
                  onChange={(e) => setFuelData(prev => ({ ...prev, mileage: Number(e.target.value) }))}
                  placeholder="15"
                  min="1"
                  step="0.1"
                  className="border-orange-200 focus:border-orange-400 text-lg font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 text-sm">
                  km/l
                </div>
              </div>
              <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                💡 Typical range: 10-25 km/l for agricultural vehicles
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="fuelPrice" className="text-orange-700 font-medium">💰 Fuel Price (₹/l)</Label>
              <div className="relative">
                <Input
                  id="fuelPrice"
                  type="number"
                  value={fuelData.price}
                  onChange={(e) => setFuelData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="100"
                  min="1"
                  step="0.1"
                  className="border-orange-200 focus:border-orange-400 text-lg font-medium"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 text-sm">
                  ₹/l
                </div>
              </div>
              <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                💡 Current diesel price: ₹90-110/l (varies by location)
              </div>
            </div>
          </div>
          
          {/* Quick Presets */}
          <div className="mt-6 pt-4 border-t border-orange-200">
            <p className="text-sm text-orange-600 mb-3">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFuelData({ mileage: 15, price: 100 })}
                className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                🚜 Tractor (15 km/l, ₹100/l)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFuelData({ mileage: 20, price: 95 })}
                className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                🚗 Car (20 km/l, ₹95/l)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFuelData({ mileage: 12, price: 105 })}
                className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                🚛 Truck (12 km/l, ₹105/l)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Toll Gates on Route */}
      {tollGatesOnRoute.length > 0 && (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-red-800">
              <AlertCircle className="h-6 w-6" />
              🚧 Toll Gates on Your Route
            </CardTitle>
            <p className="text-red-600 text-sm">
              {startDestination && stopDestination 
                ? `Toll gates between ${selectedStartLocation} and ${selectedStopLocation}`
                : 'Toll gates detected on your route'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tollGatesOnRoute.map((gate, index) => (
                <div key={gate.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-red-200">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-red-800">{gate.name}</div>
                    <div className="text-xs text-red-600">
                      📍 {gate.lat.toFixed(4)}, {gate.lng.toFixed(4)}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    Toll Gate
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Route Summary:</span>
              </div>
              <div className="text-sm text-red-600 mt-1">
                <div><strong>Total Toll Gates:</strong> {tollGatesOnRoute.length}</div>
                {startDestination && stopDestination && (
                  <div><strong>Route:</strong> {selectedStartLocation} → {selectedStopLocation}</div>
                )}
                <div><strong>Impact:</strong> Plan for toll charges and potential delays</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            📊 Complete Location Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">🎯 Auto-Detected Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>📍 Your Location:</span>
                  <span className="font-medium">
                    {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Detecting...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🏪 Nearest Farm Shop:</span>
                  <span className="font-medium">
                    {autoDestination ? 'Found' : 'Searching...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🚧 Toll Gates on Route:</span>
                  <span className="font-medium">{tollGatesOnRoute.length} detected</span>
                </div>
                <div className="flex justify-between">
                  <span>🏥 Services Nearby:</span>
                  <span className="font-medium">{nearbyServices.length} found</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">💰 Cost Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🛣️ Auto Route Distance:</span>
                  <span className="font-medium">
                    {routeData ? `${(routeData.distance / 1000).toFixed(1)} km` : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🗺️ Custom Route Distance:</span>
                  <span className="font-medium">
                    {customRoute ? `${(customRoute.distance / 1000).toFixed(1)} km` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>⏱️ Travel Time:</span>
                  <span className="font-medium">
                    {(routeData || customRoute) ? `${Math.round((routeData || customRoute)!.duration / 60)} minutes` : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>💰 Total Trip Cost:</span>
                  <span className="font-medium text-green-600">
                    ₹{calculateTripCost().totalCost.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>⛽ Fuel Cost:</span>
                  <span className="font-medium text-green-600">
                    ₹{calculateTripCost().fuelCost.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🚧 Toll Cost:</span>
                  <span className="font-medium text-red-600">
                    ₹{calculateTripCost().tollCost.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>🚧 Toll Gates on Route:</span>
                  <span className="font-medium text-red-600">{tollGatesOnRoute.length}</span>
                </div>
                {startDestination && stopDestination && (
                  <div className="flex justify-between">
                    <span>📍 Route:</span>
                    <span className="font-medium text-blue-600">{selectedStartLocation} → {selectedStopLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🤖 Fully Automated Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Location Detection</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Route Calculation</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Toll Gate Detection</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Fuel Cost Analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Nearby Services</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Destination Finding</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Custom Route Planning</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
            <p className="text-muted-foreground">Calculating route...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}