import { v4 as uuidv4 } from 'uuid';

export function generatePropertyUID(): string {
  const prefix = 'PROP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateUUID(): string {
  return uuidv4();
}

export function generateShortUID(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateOfferUID(): string {
  const prefix = 'OFFER';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Format: PROP-2024-001234
export function generateSequentialUID(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedSequence = sequenceNumber.toString().padStart(6, '0');
  return `PROP-${year}-${paddedSequence}`;
}
