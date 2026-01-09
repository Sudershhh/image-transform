/**
 * Centralized Error Handling Utilities
 * 
 * Provides user-friendly error messages and error categorization
 * for better debugging and user experience.
 */

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  BACKGROUND_REMOVAL_ERROR = 'BACKGROUND_REMOVAL_ERROR',
  FLIP_ERROR = 'FLIP_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ProcessedError {
  type: ErrorType;
  message: string;
  technicalDetails?: string;
  retryable: boolean;
}

/**
 * Extract user-friendly error message from various error sources
 */
export function processError(error: unknown): ProcessedError {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Pixelixe API errors
    if (errorMessage.includes('pixelixe')) {
      return processPixelixeError(error);
    }

    // Remove.bg API errors
    if (errorMessage.includes('remove.bg') || errorMessage.includes('removebg')) {
      return processRemoveBgError(error);
    }

    // S3/Storage errors
    if (
      errorMessage.includes('s3') ||
      errorMessage.includes('aws') ||
      errorMessage.includes('storage') ||
      errorMessage.includes('bucket')
    ) {
      return {
        type: ErrorType.STORAGE_ERROR,
        message: 'Image storage service is temporarily unavailable. Please try again.',
        technicalDetails: error.message,
        retryable: true,
      };
    }

    // Validation errors
    if (
      errorMessage.includes('invalid') ||
      errorMessage.includes('validation') ||
      errorMessage.includes('file size') ||
      errorMessage.includes('file type')
    ) {
      return {
        type: ErrorType.VALIDATION_ERROR,
        message: error.message.includes('size')
          ? 'File is too large. Maximum size is 10MB.'
          : error.message.includes('type')
          ? 'Invalid file type. Please upload a JPG, PNG, GIF, BMP, or TIFF image.'
          : error.message,
        technicalDetails: error.message,
        retryable: false,
      };
    }

    // Upload errors
    if (errorMessage.includes('upload') || errorMessage.includes('failed to upload')) {
      return {
        type: ErrorType.UPLOAD_ERROR,
        message: 'Failed to upload image. Please check your connection and try again.',
        technicalDetails: error.message,
        retryable: true,
      };
    }
  }

  // Unknown errors
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    technicalDetails: error instanceof Error ? error.message : String(error),
    retryable: true,
  };
}

/**
 * Process Pixelixe API specific errors
 */
function processPixelixeError(error: Error): ProcessedError {
  const message = error.message.toLowerCase();
  let userMessage = 'Image processing failed: Unable to flip image.';
  let retryable = true;

  // Parse error response if it contains JSON
  try {
    const jsonMatch = error.message.match(/\{.*\}/);
    if (jsonMatch) {
      const errorData = JSON.parse(jsonMatch[0]);
      const apiMessage = errorData.message?.toLowerCase() || '';

      if (apiMessage.includes('api key') || apiMessage.includes('authentication')) {
        userMessage = 'Image processing failed: Authentication error. Please contact support.';
        retryable = false;
      } else if (apiMessage.includes('rate limit') || apiMessage.includes('too many')) {
        userMessage = 'Image processing failed: Service is busy. Please try again in a moment.';
        retryable = true;
      } else if (apiMessage.includes('http status 400') || apiMessage.includes('400')) {
        userMessage = 'Image processing failed: Unable to access image. Please try uploading again.';
        retryable = true;
      } else if (apiMessage.includes('http status 500') || apiMessage.includes('500')) {
        userMessage = 'Image processing failed: Service temporarily unavailable. Please try again.';
        retryable = true;
      } else if (apiMessage.includes('image') && apiMessage.includes('url')) {
        userMessage = 'Image processing failed: Invalid image URL. Please try uploading again.';
        retryable = true;
      }
    }
  } catch {
    // If JSON parsing fails, use default message
  }

  // Check HTTP status codes in error message
  if (message.includes('401') || message.includes('unauthorized')) {
    userMessage = 'Image processing failed: Authentication error. Please contact support.';
    retryable = false;
  } else if (message.includes('403') || message.includes('forbidden')) {
    userMessage = 'Image processing failed: Access denied. Please contact support.';
    retryable = false;
  } else if (message.includes('429') || message.includes('rate limit')) {
    userMessage = 'Image processing failed: Too many requests. Please try again in a moment.';
    retryable = true;
  } else if (message.includes('500') || message.includes('internal server error')) {
    userMessage = 'Image processing failed: Service temporarily unavailable. Please try again.';
    retryable = true;
  }

  return {
    type: ErrorType.FLIP_ERROR,
    message: userMessage,
    technicalDetails: error.message,
    retryable,
  };
}

/**
 * Process Remove.bg API specific errors
 */
function processRemoveBgError(error: Error): ProcessedError {
  const message = error.message.toLowerCase();
  let userMessage = 'Image processing failed: Unable to remove background.';
  let retryable = true;

  // Parse error response if it contains JSON
  try {
    const jsonMatch = error.message.match(/\{.*\}/);
    if (jsonMatch) {
      const errorData = JSON.parse(jsonMatch[0]);
      const apiMessage = errorData.error?.message?.toLowerCase() || errorData.message?.toLowerCase() || '';

      if (apiMessage.includes('api key') || apiMessage.includes('authentication')) {
        userMessage = 'Image processing failed: Authentication error. Please contact support.';
        retryable = false;
      } else if (apiMessage.includes('rate limit') || apiMessage.includes('quota')) {
        userMessage = 'Image processing failed: Service quota exceeded. Please try again later.';
        retryable = false;
      } else if (apiMessage.includes('file size') || apiMessage.includes('too large')) {
        userMessage = 'Image processing failed: File is too large. Maximum size is 10MB.';
        retryable = false;
      } else if (apiMessage.includes('invalid') || apiMessage.includes('format')) {
        userMessage = 'Image processing failed: Invalid image format. Please upload a valid image.';
        retryable = false;
      }
    }
  } catch {
    // If JSON parsing fails, use default message
  }

  // Check HTTP status codes
  if (message.includes('401') || message.includes('unauthorized')) {
    userMessage = 'Image processing failed: Authentication error. Please contact support.';
    retryable = false;
  } else if (message.includes('402') || message.includes('payment')) {
    userMessage = 'Image processing failed: Service quota exceeded. Please try again later.';
    retryable = false;
  } else if (message.includes('429') || message.includes('rate limit')) {
    userMessage = 'Image processing failed: Too many requests. Please try again in a moment.';
    retryable = true;
  } else if (message.includes('500') || message.includes('internal server error')) {
    userMessage = 'Image processing failed: Service temporarily unavailable. Please try again.';
    retryable = true;
  }

  return {
    type: ErrorType.BACKGROUND_REMOVAL_ERROR,
    message: userMessage,
    technicalDetails: error.message,
    retryable,
  };
}

/**
 * Format error for database storage
 */
export function formatErrorForDatabase(error: ProcessedError): string {
  return error.message;
}
