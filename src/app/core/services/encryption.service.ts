import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const GAME_SECRET_KEY = 'MiClaveSecreta123!';

/**
 * Standalone function - computes SHA256 hash.
 * Can be used without injecting the service.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Standalone function - generates backend-compatible token.
 * Format: SHA256(userId:timestamp:secretKey)
 * Can be used without injecting the service.
 */
export async function generateSignedToken(userId: string | number, timestamp: number): Promise<string> {
  const payload = `${userId}:${timestamp}:${GAME_SECRET_KEY}`;
  return sha256(payload);
}

/**
 * Standalone function - generates token with current timestamp.
 * Convenience wrapper.
 */
export async function generateToken(userId: string | number): Promise<{ token: string; timestamp: number }> {
  const timestamp = Math.floor(Date.now() / 1000);
  const token = await generateSignedToken(userId, timestamp);
  return { token, timestamp };
}

/**
 * Encryption service using Web Crypto API for SHA256 hashing.
 */
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Delegate to standalone functions for consistency
  sha256 = sha256;
  generateSignedToken = generateSignedToken;
  generateUniqueToken = generateToken;
}
