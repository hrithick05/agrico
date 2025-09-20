import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  QrCode,
  Copy,
  CheckCircle,
  AlertCircle,
  Package,
  Calendar,
  Shield,
  Clock,
  Home
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface AddressForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

export default function Pay() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, getOrderItems, getEquipmentItems } = useCart();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const orderItems = getOrderItems();
  const equipmentItems = getEquipmentItems();
  const total = getCartTotal();

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!addressForm.fullName || !addressForm.phone || !addressForm.address || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setStep('payment');
  };

  const handlePaymentMethod = (method: 'cod' | 'online') => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please choose a payment method",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been placed. ${paymentMethod === 'cod' ? 'Cash on delivery' : 'Online payment'} confirmed.`,
      });
      
      // Clear cart and redirect
      clearCart();
      navigate('/orders');
    }, 2000);
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText('suryailasu10@okaxis');
    toast({
      title: "UPI ID Copied",
      description: "UPI ID copied to clipboard",
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some items to your cart before proceeding to payment
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/orders')}>
                  Browse Bulk Orders
                </Button>
                <Button onClick={() => navigate('/equipment')} variant="outline">
                  Browse Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header without navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-green-600" />
                <span className="text-xl font-bold text-gray-900">AgroConnect</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Secure Payment Process
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment & Delivery</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Form */}
            {step === 'address' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                        placeholder="Enter your complete address"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          placeholder="Enter city"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                          placeholder="Enter state"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                          placeholder="Enter pincode"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                        placeholder="Nearby landmark for easy delivery"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Continue to Payment Options
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Payment Options */}
            {step === 'payment' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Choose Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cash on Delivery */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentMethod('cod')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === 'cod' ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Online Payment */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePaymentMethod('online')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === 'online' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        <QrCode className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Online Payment</h3>
                        <p className="text-sm text-gray-600">Pay instantly with UPI</p>
                      </div>
                      {paymentMethod === 'online' && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </div>

                  {/* QR Code for Online Payment */}
                  {paymentMethod === 'online' && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <h3 className="font-semibold mb-4">Scan QR Code to Pay</h3>
                          
                          {/* QR Code */}
                          <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-sm">
                            <div className="w-48 h-48 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              <img 
                                src="/img/WhatsApp Image 2025-09-12 at 16.46.18_94760e9d.jpg"
                                alt="UPI QR Code"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            Scan to pay with any UPI app
                          </p>
                          
                          <div className="bg-white p-3 rounded-lg mb-4">
                            <p className="text-sm font-medium mb-1">Indian Overseas Bank 5320</p>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm">UPI ID: suryailasu10@okaxis</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={copyUPIId}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Shield className="h-3 w-3" />
                            <span>Secure UPI payment</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={!paymentMethod || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bulk Orders */}
                {orderItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Bulk Orders</span>
                      <Badge variant="secondary">{orderItems.length}</Badge>
                    </div>
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{((item.pricePerUnit || 0) * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Equipment Rental */}
                {equipmentItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Equipment Rental</span>
                      <Badge variant="secondary">{equipmentItems.length}</Badge>
                    </div>
                    {equipmentItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{((item.pricePerDay || 0) * item.quantity).toLocaleString('en-IN')}/day</span>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toLocaleString('en-IN')}</span>
                </div>

                {equipmentItems.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>Equipment rental is charged per day</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Secure payment processing</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Preview */}
            {step === 'payment' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{addressForm.fullName}</p>
                    <p>{addressForm.address}</p>
                    <p>{addressForm.city}, {addressForm.state} - {addressForm.pincode}</p>
                    {addressForm.landmark && <p>Near: {addressForm.landmark}</p>}
                    <p className="text-gray-600">{addressForm.phone}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep('address')}
                    className="w-full mt-3"
                  >
                    Change Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
