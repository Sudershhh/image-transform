/**
 * Centralized Environment Variables Configuration
 *
 * This file provides a single source of truth for all environment variables.
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvOptional(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] || defaultValue;
}

export const env = {
  // Database
  DATABASE_URL: getEnv("DATABASE_URL"),

  // AWS S3 Configuration
  AWS_ACCESS_KEY_ID: getEnv("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: getEnv("AWS_SECRET_ACCESS_KEY"),
  AWS_REGION: getEnv("AWS_REGION", "us-east-1"),
  AWS_S3_BUCKET_NAME: getEnv("AWS_S3_BUCKET_NAME"),

  // External APIs
  BG_REMOVE_API_KEY: getEnv("BG_REMOVE_API_KEY"),
  PIXELIXE_API_KEY: getEnv("PIXELIXE_API_KEY"),

  // App Configuration
  NODE_ENV: getEnvOptional("NODE_ENV", "development"),
  NEXT_PUBLIC_APP_URL: getEnvOptional(
    "NEXT_PUBLIC_APP_URL",
    "http://localhost:3000"
  ),
} as const;

// Validate critical environment variables on module load
if (typeof window === "undefined") {
  // Server-side validation
  const requiredVars = [
    "DATABASE_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_S3_BUCKET_NAME",
    "BG_REMOVE_API_KEY",
    "PIXELIXE_API_KEY",
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(", ")}\n` +
        `Please check your .env file.`
    );
  }
}
