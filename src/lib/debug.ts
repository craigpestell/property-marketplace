// List of test user emails that should see debug features
export const DEBUG_USERS = [
  // Development/Test users
  'test@example.com',
  'demo@example.com',
  'admin@example.com',
  'craig@example.com', // Add your email here
  'testuser@propertymarketplace.com',
  'debug@propertymarketplace.com',

  // QA Team emails (add your team's emails here)
  'qa@propertymarketplace.com',
  'testing@propertymarketplace.com',

  // Add more test user emails as needed
];

export function isDebugUser(email?: string | null): boolean {
  if (!email) return false;
  return DEBUG_USERS.includes(email.toLowerCase());
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Show debug features if user is a debug user OR if in development mode
export function showDebugFeatures(email?: string | null): boolean {
  //return isDebugUser(email) || isDevelopment();
  return isDebugUser(email);
}
