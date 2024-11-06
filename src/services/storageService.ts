import { DdcClient, TESTNET } from '@cere-ddc-sdk/ddc-client';
import { config } from '../config';
import { readFileSync } from 'fs';

export const initStorageClient = async () => {
  try {
    const credentials = JSON.parse(
      readFileSync(config.env.WALLET_CREDS, 'utf-8'),
    );

    const ddcClient = await DdcClient.create(credentials.secret, TESTNET);

    return ddcClient;
  } catch (error) {
    console.error('Failed to initialize storage client:', error);
    throw error;
  }
};
