import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Plus, 
  Minus, 
  Trash2,
  CheckCircle,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Shield,
  TruckIcon,
  Star,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartItemCount, 
    getCartTotal,
    getOrderItems,
    getEquipmentItems
  } = useCart();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const orderItems = getOrderItems();
  const equipmentItems = getEquipmentItems();

  const handleQuantityChange = (id: number, type: 'order' | 'equipment', newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id, type);
      toast({
        title: "Item Removed",
        description: "Item removed from cart",
      });
    } else {
      updateQuantity(id, type, newQuantity);
    }
  };

  const handleRemoveItem = (id: number, type: 'order' | 'equipment', name: string) => {
    removeFromCart(id, type);
    toast({
      title: "Item Removed",
      description: `${name} removed from cart`,
    });
  };


  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }

    // Navigate to payment page
    navigate('/pay');
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Professional Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shopping
            </Button>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 p-4 rounded-2xl shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                  <p className="text-lg text-gray-600">
                    Your cart is empty. Discover amazing farming supplies and equipment!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Empty State */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your farming toolkit by browsing our premium agricultural supplies and equipment rentals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/orders')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Browse Bulk Orders
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/equipment')}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Browse Equipment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">Your payment information is protected with bank-level security</p>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick delivery to your farm location within 24-48 hours</p>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">Premium quality products with satisfaction guarantee</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shopping
          </Button>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 p-4 rounded-2xl shadow-lg">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                  <p className="text-lg text-gray-600">
                    {getCartItemCount()} items • ₹{getCartTotal().toLocaleString()} total
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowClearConfirm(true)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <Button
                  onClick={() => navigate('/orders')}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Items
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            {orderItems.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    Bulk Orders
                    <Badge variant="secondary" className="bg-green-200 text-green-800">
                      {orderItems.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={`order-${item.id}`} className="group">
                        <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300">
                          <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">₹{item.pricePerUnit.toLocaleString()}</span>
                              <span className="text-sm text-gray-500">per unit</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 'order', item.quantity - 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, 'order', parseInt(e.target.value) || 0)}
                                className="w-16 text-center border-0 bg-transparent font-semibold"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 'order', item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right min-w-[120px]">
                              <p className="text-xl font-bold text-gray-900">
                                ₹{(item.pricePerUnit * item.quantity).toLocaleString()}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, 'order', item.title)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < orderItems.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Equipment Items */}
            {equipmentItems.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    Equipment Rental
                    <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                      {equipmentItems.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {equipmentItems.map((item, index) => (
                      <div key={`equipment-${item.id}`} className="group">
                        <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                            <Truck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.equipmentType}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-blue-600">₹{(item.pricePerDay || 0).toLocaleString()}</span>
                              <span className="text-sm text-gray-500">per day</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 'equipment', item.quantity - 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, 'equipment', parseInt(e.target.value) || 0)}
                                className="w-16 text-center border-0 bg-transparent font-semibold"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 'equipment', item.quantity + 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right min-w-[120px]">
                              <p className="text-xl font-bold text-gray-900">
                                ₹{((item.pricePerDay || 0) * item.quantity).toLocaleString()}/day
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, 'equipment', item.name)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < equipmentItems.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Professional Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Order Items Summary */}
                {orderItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Bulk Orders</h4>
                    </div>
                    <div className="space-y-2">
                      {orderItems.map((item) => (
                        <div key={`summary-order-${item.id}`} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{item.title}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold text-green-600">₹{(item.pricePerUnit * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Items Summary */}
                {equipmentItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Equipment Rental</h4>
                    </div>
                    <div className="space-y-2">
                      {equipmentItems.map((item) => (
                        <div key={`summary-equipment-${item.id}`} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold text-blue-600">₹{((item.pricePerDay || 0) * item.quantity).toLocaleString()}/day</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-xl font-bold mb-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  {equipmentItems.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4" />
                      <span>Equipment rental is charged per day</span>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Buy
                </Button>

                {/* Trust Indicators */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <TruckIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Fast delivery to your location</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Star className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">Quality guarantee on all items</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Continue Shopping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Browse Bulk Orders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => navigate('/equipment')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Browse Equipment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Clear Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove all items from your cart? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
