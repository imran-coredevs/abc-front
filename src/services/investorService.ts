import { api } from '@/config/apiConfig';

// ──────────────────────────────────────────────────────────────────────────────
// Types matching backend DTOs
// ──────────────────────────────────────────────────────────────────────────────

export type FeeTier = 
  | 'REGULAR' 
  | 'VIP1' 
  | 'VIP2' 
  | 'VIP3' 
  | 'VIP4' 
  | 'VIP5' 
  | 'VIP6' 
  | 'VIP7' 
  | 'VIP8' 
  | 'VIP9';

export interface InvestorProfile {
  id: string;
  email: string;
  name: string;
  lastLoginAt: string;
  feeTier: FeeTier;
  hasCredentials: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
}

export interface BinanceCredentialsDto {
  apiKey: string;
  apiSecret: string;
}

export interface BinanceBalance {
  totalWalletBalance: number;
  availableBalance: number;
  unrealizedPnL: number;
  source: 'cache' | 'live';
}

export interface CredentialsResponse {
  message: string;
  hasCredentials: boolean;
}

export interface BinanceCredentialsStatus {
  hasCredentials: boolean;
  apiKeyMasked?: string;
  lastUpdated?: string;
}

export interface FeeTierResponse {
  message: string;
  feeTier: FeeTier;
}

// ──────────────────────────────────────────────────────────────────────────────
// Investor Service
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Get current investor profile
 * @returns Investor profile with hasCredentials flag
 */
export const getProfile = async (): Promise<InvestorProfile> => {
  const response = await api.get<InvestorProfile>('/investor/profile');
  return response.data;
};

/**
 * Update investor profile (name, email)
 */
export const updateProfile = async (data: UpdateProfileDto): Promise<InvestorProfile> => {
  const response = await api.put<InvestorProfile>('/investor/profile', data);
  return response.data;
};

/**
 * Get Binance credentials status
 * @returns Status with masked API key if credentials exist
 */
export const getBinanceCredentials = async (): Promise<BinanceCredentialsStatus> => {
  const response = await api.get<{ data: BinanceCredentialsStatus }>('/investor/binance-credentials');
  return response.data.data;
};

/**
 * Set or update Binance API credentials
 * @param credentials - { apiKey, apiSecret }
 */
export const updateBinanceCredentials = async (
  credentials: BinanceCredentialsDto
): Promise<CredentialsResponse> => {
  const response = await api.put<CredentialsResponse>(
    '/investor/binance-credentials',
    credentials
  );
  return response.data;
};

/**
 * Remove Binance API credentials
 */
export const removeBinanceCredentials = async (): Promise<CredentialsResponse> => {
  const response = await api.delete<CredentialsResponse>('/investor/binance-credentials');
  return response.data;
};

/**
 * Get Binance Futures USDT balance
 * Returns cached balance if available, otherwise fetches from Binance API
 */
export const getBinanceBalance = async (): Promise<BinanceBalance> => {
  const response = await api.get<BinanceBalance>('/investor/balance');
  return response.data;
};

/**
 * Update Binance fee tier (VIP level)
 */
export const updateFeeTier = async (feeTier: FeeTier): Promise<FeeTierResponse> => {
  const response = await api.put<FeeTierResponse>('/investor/fee-tier', { feeTier });
  return response.data;
};

/**
 * Delete investor account (soft delete)
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>('/investor/account');
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getBinanceCredentials,
  updateBinanceCredentials,
  removeBinanceCredentials,
  getBinanceBalance,
  updateFeeTier,
  deleteAccount,
};
