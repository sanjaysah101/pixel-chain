import { DdcClient, JsonSigner, TESTNET } from '@cere-ddc-sdk/ddc-client';
import { config } from '../config';
import { readFileSync } from 'fs';

export const initStorageClient = async () => {
  try {
    // Validate environment variables
    if (!config.env.WALLET_CREDS || !config.env.CERE_BUCKET_ID) {
      throw new Error('Missing required environment variables');
    }

    const keyFileContent = readFileSync(config.env.WALLET_CREDS, 'utf-8');
    const keyFileJson = JSON.parse(keyFileContent);

    // Validate key file format
    if (
      !keyFileJson.encoded ||
      !keyFileJson.encoding ||
      !keyFileJson.address ||
      !keyFileJson.meta
    ) {
      throw new Error('Invalid key file format');
    }

    // Create signer with credentials
    const signer = new JsonSigner(
      {
        encoded: keyFileJson.encoded,
        encoding: keyFileJson.encoding,
        address: keyFileJson.address,
        meta: keyFileJson.meta,
      },
      {
        passphrase: config.env.WALLET_CREDS_PASSWORD || '',
      }
    );

    // Initialize DDC client
    const ddcClient = await DdcClient.create(signer, TESTNET);

    // Ensure client is connected
    await ddcClient.connect();

    // Verify bucket access
    try {
      const bucketId = BigInt(config.env.CERE_BUCKET_ID);
      await ddcClient.getBucket(bucketId);
    } catch (error) {
      throw new Error(
        `Bucket access verification failed: ${(error as Error).message}`
      );
    }

    return ddcClient;
  } catch (error) {
    console.error('Failed to initialize storage client:', error);
    throw error;
  }
};
