import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_Z3VpZGluZy13b2xmLTQxLmNsZXJrLmFjY291bnRzLmRldiQ";

console.log("Environment variable:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
console.log("Final key:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ClerkProvider>
);
