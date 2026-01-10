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
  get DATABASE_URL() {
    return getEnv("DATABASE_URL");
  },

  get AWS_ACCESS_KEY_ID() {
    return getEnv("AWS_ACCESS_KEY_ID");
  },
  get AWS_SECRET_ACCESS_KEY() {
    return getEnv("AWS_SECRET_ACCESS_KEY");
  },
  get AWS_REGION() {
    return getEnv("AWS_REGION", "us-east-1");
  },
  get AWS_S3_BUCKET_NAME() {
    return getEnv("AWS_S3_BUCKET_NAME");
  },

  get BG_REMOVE_API_KEY() {
    return getEnv("BG_REMOVE_API_KEY");
  },
  get PIXELIXE_API_KEY() {
    return getEnv("PIXELIXE_API_KEY");
  },

  get NODE_ENV() {
    return getEnvOptional("NODE_ENV", "development");
  },
  get NEXT_PUBLIC_APP_URL() {
    return getEnvOptional("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
  },
} as const;

if (typeof window === "undefined") {
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
