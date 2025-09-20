import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  X, 
  Camera, 
  Save,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddEquipmentFormProps {
  onClose: () => void;
  onSuccess?: (equipment: any) => void;
}

export default function AddEquipmentForm({ onClose, onSuccess }: AddEquipmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    owner: "",
    location: "",
    availability: "Available",
    price: "",
    original_price: "",
    discount: "",
    rating: 4.5,
    reviews: 0,
    features: [] as string[],
    next_available: "Today",
    offer: "Bank Offer",
    sponsored: false,
    description: ""
  });
  
  const [featureInput, setFeatureInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const equipmentTypes = [
    "Tractor", "Harvester", "Tiller", "Planter", "Sprayer", 
    "Cultivator", "Plough", "Seeder", "Mower", "Loader"
  ];

  const offerTypes = [
    "Bank Offer", "Big Billion Days Price", "Assured", "Bestseller", "Special Offer"
  ];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Convert image to base64 for local storage
      let imageUrl = '/placeholder.svg';
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imageUrl = e.target?.result as string;
        };
        reader.readAsDataURL(imageFile);
        
        // Wait for image to be processed
        await new Promise(resolve => {
          reader.onloadend = resolve;
        });
        imageUrl = reader.result as string;
      }

      // Create equipment object for local storage
      const newEquipment = {
        ...formData,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({
        title: "Success!",
        description: "Equipment added successfully",
      });

      onSuccess?.(newEquipment);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = formData.name && formData.type && formData.owner && formData.location && formData.price;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Add New Equipment
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Share your farming equipment with the community
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Equipment Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Equipment Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., John Deere Tractor 5075E"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {/* Equipment Type */}
              <div>
                <Label htmlFor="type" className="text-sm font-medium">
                  Equipment Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Owner Name */}
              <div>
                <Label htmlFor="owner" className="text-sm font-medium">
                  Owner Name *
                </Label>
                <Input
                  id="owner"
                  placeholder="Your name"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Village Kharpur"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Daily Rate *
                  </Label>
                  <Input
                    id="price"
                    placeholder="₹800"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price" className="text-sm font-medium">
                    Original Price
                  </Label>
                  <Input
                    id="original_price"
                    placeholder="₹1,200"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating" className="text-sm font-medium">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 4.5)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="reviews" className="text-sm font-medium">
                    Number of Reviews
                  </Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.reviews}
                    onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium">Equipment Image</Label>
                <div className="mt-1">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload equipment image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-sm font-medium">Features</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 75 HP, 4WD"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeFeature(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div>
                <Label htmlFor="offer" className="text-sm font-medium">
                  Offer Type
                </Label>
                <Select value={formData.offer} onValueChange={(value) => handleInputChange('offer', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {offerTypes.map(offer => (
                      <SelectItem key={offer} value={offer}>{offer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="next_available" className="text-sm font-medium">
                  Next Available
                </Label>
                <Input
                  id="next_available"
                  placeholder="Today"
                  value={formData.next_available}
                  onChange={(e) => handleInputChange('next_available', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the equipment..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Equipment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
