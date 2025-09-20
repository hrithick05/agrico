import React from 'react';

interface PaymentLayoutProps {
  children: React.ReactNode;
}

export function PaymentLayout({ children }: PaymentLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
