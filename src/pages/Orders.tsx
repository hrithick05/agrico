import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Clock,
  Plus,
  Minus,
  CheckCircle,
  Truck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const bulkDeals = [
  {
    id: 1,
    title: "Premium Wheat Seeds",
    description: "High-yield variety, disease resistant",
    minQuantity: 50,
    currentOrders: 32,
    pricePerUnit: 85,
    originalPrice: 100,
    savings: 15,
    deadline: "March 20, 2024",
    category: "Seeds",
    status: "Active"
  },
  {
    id: 2,
    title: "NPK Fertilizer Bags",
    description: "Balanced nutrition for all crops",
    minQuantity: 100,
    currentOrders: 87,
    pricePerUnit: 1200,
    originalPrice: 1400,
    savings: 200,
    deadline: "March 18, 2024",
    category: "Fertilizer",
    status: "Almost Full"
  },
  {
    id: 3,
    title: "Organic Pesticide",
    description: "Eco-friendly crop protection",
    minQuantity: 30,
    currentOrders: 12,
    pricePerUnit: 450,
    originalPrice: 550,
    savings: 100,
    deadline: "March 25, 2024",
    category: "Pesticide",
    status: "Active"
  },
  {
    id: 4,
    title: "Drip Irrigation Kit",
    description: "Complete water management system",
    minQuantity: 20,
    currentOrders: 18,
    pricePerUnit: 2800,
    originalPrice: 3200,
    savings: 400,
    deadline: "March 22, 2024",
    category: "Equipment",
    status: "Almost Full"
  }
];

export default function Orders() {
  const { addToCart, getCartItemCount, getCartTotal, getOrderItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (deal: any) => {
    addToCart({
      id: deal.id,
      title: deal.title,
      pricePerUnit: deal.pricePerUnit || 0,
      quantity: 1,
      category: deal.category,
      type: 'order'
    });
    
    toast({
      title: "Added to Cart! 🛒",
      description: `${deal.title} added to cart`,
      variant: "default"
    });
  };

  const submitOrder = () => {
    if (getCartItemCount() === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before submitting",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Submitted! 🎉",
      description: `Order for ₹${getCartTotal().toLocaleString()} submitted successfully. You'll be notified when the minimum quantity is reached.`,
      variant: "default"
    });
    setCart({});
  };

  const getProgressPercentage = (current: number, min: number) => {
    return Math.min((current / min) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-secondary rounded-2xl p-8 text-white shadow-glow">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collective Orders</h1>
            <p className="text-lg opacity-90">
              Join bulk purchases to get better prices on farming supplies
            </p>
          </div>
          {/* Cart Button */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getCartItemCount() > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white text-xs">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <Card className="shadow-hover border-agricultural-green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Cart Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {getCartItemCount()} items • ₹{getCartTotal().toLocaleString()}
                  </p>
                </div>
              </div>
              <Button 
                onClick={submitOrder}
                className="bg-agricultural-green hover:bg-agricultural-green-light animate-pulse-glow"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bulkDeals.map((deal, index) => (
          <Card 
            key={deal.id} 
            className="hover:shadow-hover transition-all duration-300 group animate-bounce-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                </div>
                <Badge 
                  variant={deal.status === "Almost Full" ? "default" : "secondary"}
                  className={deal.status === "Almost Full" ? "bg-agricultural-gold text-white" : ""}
                >
                  {deal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {deal.currentOrders}/{deal.minQuantity} orders
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(deal.currentOrders, deal.minQuantity)}%` }}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Bulk Price</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-agricultural-green">
                      ₹{deal.pricePerUnit}
                    </span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{deal.originalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Save ₹{deal.savings} per unit
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Deadline: {deal.deadline}
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(deal)}
                  className="bg-agricultural-green hover:bg-agricultural-green-light"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {deal.minQuantity - deal.currentOrders} more needed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it Works */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            How Collective Orders Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mx-auto">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">1. Browse Deals</h3>
              <p className="text-sm text-muted-foreground">
                Find bulk purchase deals with significant savings on farming supplies
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-gradient-secondary p-3 rounded-lg w-fit mx-auto">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">2. Add to Cart</h3>
              <p className="text-sm text-muted-foreground">
                Select quantities and submit your order to join the collective purchase
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-gradient-primary p-3 rounded-lg w-fit mx-auto">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">3. Get Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Once minimum quantity is reached, enjoy discounted prices and delivery
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}