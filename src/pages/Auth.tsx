import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";

// Component that uses Clerk hooks - only rendered when Clerk is available
const ClerkAuthContent = () => {
  const { user, isSignedIn } = useUser();
  
  // If signed in, redirect to dashboard
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Welcome to AgroConnect
        </h3>
        <p className="text-gray-600 text-sm">
          Join thousands of farmers in our community
        </p>
      </div>
      
      <div className="space-y-3">
        <SignInButton mode="modal">
          <Button className="w-full" size="lg">
            Sign In
          </Button>
        </SignInButton>
        
        <SignUpButton mode="modal">
          <Button variant="outline" className="w-full" size="lg">
            Create Account
          </Button>
        </SignUpButton>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          🚀 What you'll get access to:
        </h4>
        <ul className="text-green-700 text-sm space-y-1">
          <li>• Equipment marketplace</li>
          <li>• Community forum</li>
          <li>• Micro-lending circles</li>
          <li>• Expense tracking</li>
          <li>• AI-powered insights</li>
          <li>• Government schemes</li>
          <li>• Banking services</li>
        </ul>
      </div>
    </div>
  );
};

// Fallback content when Clerk is not available
const FallbackAuthContent = () => (
  <div className="space-y-4">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Authentication Setup Required
      </h3>
      <p className="text-gray-600 text-sm">
        Clerk authentication is not configured yet
      </p>
    </div>
    
    <div className="bg-yellow-50 rounded-lg p-4">
      <h4 className="font-semibold text-yellow-800 mb-2">
        🔧 Setup Instructions
      </h4>
      <ol className="text-yellow-700 text-sm space-y-1">
        <li>1. Get your Clerk publishable key from clerk.com</li>
        <li>2. Add it to your .env.local file:</li>
        <li className="ml-4">VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here</li>
        <li>3. Restart your development server</li>
      </ol>
    </div>

    <div className="space-y-3">
      <Button className="w-full" size="lg" asChild>
        <a href="https://clerk.com" target="_blank" rel="noopener noreferrer">
          Get Clerk Key
        </a>
      </Button>
      
      <Button variant="outline" className="w-full" size="lg" asChild>
        <a href="/" target="_blank" rel="noopener noreferrer">
          Continue to App
        </a>
      </Button>
    </div>
  </div>
);

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              🌾 AgroConnect
            </CardTitle>
            <p className="text-gray-600">
              Please sign in to access the farming platform
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ClerkAuthContent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
