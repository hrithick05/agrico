import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Car, 
  Truck, 
  Tractor, 
  Calculator, 
  TrendingDown,
  Info,
  Zap,
  TreePine,
  Wind
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: number;
  name: string;
  type: string;
  owner: string;
  location: string;
  availability: string;
  price: string;
  rating: number;
  reviews: number;
  features: string[];
}

interface CarbonFootprintCalculatorProps {
  equipment?: Equipment;
  onClose?: () => void;
}

// Carbon emission factors (kg CO2 per hour of operation)
const EMISSION_FACTORS = {
  'Tractor': 12.5, // Diesel tractor
  'Harvester': 15.2, // Combine harvester
  'Tiller': 8.7, // Rotary tiller
  'Planter': 9.3, // Seed drill machine
  'Sprayer': 6.4, // Sprayer machine
  'Cultivator': 10.1, // Cultivator
  'Plough': 11.8, // Plough
  'Seeder': 8.9, // Seeder
  'Mower': 7.2, // Mower
  'Loader': 11.3, // Loader
  'default': 10.0 // Default for unknown types
};

// Fuel efficiency factors (varies by equipment type and condition)
const FUEL_EFFICIENCY = {
  'Tractor': 0.85, // 85% efficiency
  'Harvester': 0.80, // 80% efficiency
  'Tiller': 0.90, // 90% efficiency
  'Planter': 0.88, // 88% efficiency
  'Sprayer': 0.92, // 92% efficiency
  'Cultivator': 0.87, // 87% efficiency
  'Plough': 0.83, // 83% efficiency
  'Seeder': 0.89, // 89% efficiency
  'Mower': 0.91, // 91% efficiency
  'Loader': 0.84, // 84% efficiency
  'default': 0.85
};

export default function CarbonFootprintCalculator({ equipment, onClose }: CarbonFootprintCalculatorProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(equipment || null);
  const [usageHours, setUsageHours] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("diesel");
  const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
  const [equivalents, setEquivalents] = useState({
    trees: 0,
    carKm: 0,
    electricity: 0
  });
  const { toast } = useToast();

  // Calculate carbon footprint when inputs change
  useEffect(() => {
    if (selectedEquipment && usageHours && !isNaN(Number(usageHours))) {
      calculateCarbonFootprint();
    }
  }, [selectedEquipment, usageHours, fuelType]);

  const calculateCarbonFootprint = () => {
    if (!selectedEquipment || !usageHours) return;

    const hours = Number(usageHours);
    const equipmentType = selectedEquipment.type;
    const emissionFactor = EMISSION_FACTORS[equipmentType as keyof typeof EMISSION_FACTORS] || EMISSION_FACTORS.default;
    const efficiency = FUEL_EFFICIENCY[equipmentType as keyof typeof FUEL_EFFICIENCY] || FUEL_EFFICIENCY.default;
    
    // Base calculation: emission factor × hours × efficiency
    let baseEmissions = emissionFactor * hours * efficiency;
    
    // Fuel type multiplier
    const fuelMultipliers = {
      'diesel': 1.0,
      'petrol': 0.95,
      'electric': 0.3,
      'biodiesel': 0.7
    };
    
    baseEmissions *= fuelMultipliers[fuelType as keyof typeof fuelMultipliers] || 1.0;
    
    setCarbonFootprint(Math.round(baseEmissions * 100) / 100);
    
    // Calculate equivalents
    setEquivalents({
      trees: Math.round(baseEmissions / 22), // Average tree absorbs 22kg CO2/year
      carKm: Math.round(baseEmissions / 0.12), // Average car emits 120g CO2/km
      electricity: Math.round(baseEmissions / 0.4) // Average electricity emits 400g CO2/kWh
    });
  };

  const getEmissionLevel = (emissions: number) => {
    if (emissions < 20) return { level: "Low", color: "bg-green-500", textColor: "text-green-700" };
    if (emissions < 50) return { level: "Medium", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { level: "High", color: "bg-red-500", textColor: "text-red-700" };
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'Tractor': return <Tractor className="h-5 w-5" />;
      case 'Harvester': return <Truck className="h-5 w-5" />;
      case 'Loader': return <Truck className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const emissionLevel = getEmissionLevel(carbonFootprint);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Carbon Footprint Calculator
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Calculate environmental impact of your equipment rental
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Equipment Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="equipment-select" className="text-sm font-medium">
                Select Equipment
              </Label>
              {selectedEquipment ? (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getEquipmentIcon(selectedEquipment.type)}
                    <div>
                      <p className="font-medium text-sm">{selectedEquipment.name}</p>
                      <p className="text-xs text-gray-600">{selectedEquipment.type}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No equipment selected. Please select equipment from the list above.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="usage-hours" className="text-sm font-medium">
                Usage Duration (Hours)
              </Label>
              <Input
                id="usage-hours"
                type="number"
                placeholder="e.g., 8"
                value={usageHours}
                onChange={(e) => setUsageHours(e.target.value)}
                className="mt-1"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <Label htmlFor="fuel-type" className="text-sm font-medium">
                Fuel Type
              </Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="biodiesel">Biodiesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {carbonFootprint > 0 && (
              <>
                {/* Main Result */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Wind className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Carbon Footprint</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {carbonFootprint} kg CO₂
                    </div>
                    <Badge className={`${emissionLevel.color} ${emissionLevel.textColor} border-0`}>
                      {emissionLevel.level} Impact
                    </Badge>
                  </div>
                </div>

                {/* Equivalents */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Environmental Impact Equivalents:</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <TreePine className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Trees needed to offset</p>
                        <p className="text-xs text-gray-600">{equivalents.trees} trees for 1 year</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Car className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Equivalent car distance</p>
                        <p className="text-xs text-gray-600">{equivalents.carKm} km driven</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Electricity equivalent</p>
                        <p className="text-xs text-gray-600">{equivalents.electricity} kWh consumed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Info Panel */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-1">Calculation Factors:</p>
                  <ul className="space-y-1">
                    <li>• Equipment type and efficiency</li>
                    <li>• Fuel type and emission factors</li>
                    <li>• Usage duration</li>
                    <li>• Based on IPCC emission standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {carbonFootprint > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-3">Eco-Friendly Recommendations:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Optimize Usage</p>
                  <p className="text-xs text-green-700">
                    Combine multiple tasks in one session to reduce fuel consumption
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Leaf className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Consider Alternatives</p>
                  <p className="text-xs text-blue-700">
                    Electric or biodiesel-powered equipment for lower emissions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <TreePine className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-800">Carbon Offsetting</p>
                  <p className="text-xs text-purple-700">
                    Plant {equivalents.trees} trees to offset this equipment usage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Calculator className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Track Progress</p>
                  <p className="text-xs text-orange-700">
                    Monitor your carbon footprint across all farming activities
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
