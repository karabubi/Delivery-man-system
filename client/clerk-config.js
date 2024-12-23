import { ClerkProvider } from "@clerk/clerk-react";

// Use environment variables to store sensitive data.
const clerkFrontendApi = import.meta.env.CLERK_FRONTEND_API;

// Make sure the environment variable is defined, otherwise log an error.
if (!clerkFrontendApi) {
  console.error('Clerk frontend API key (VITE_CLERK_FRONTEND_API) is missing from the environment variables.');
}

export const ClerkConfig = ({ children }) => {
  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      {children}
    </ClerkProvider>
  );
};


