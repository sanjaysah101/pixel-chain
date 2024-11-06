export interface WalletCredentials {
  encoded: string;
  encoding: {
    content: string[];
    type: string[];
    version: string;
  };
  address: string;
  meta: any;
  secret: string;
  credsFileLocation: string;
}

export interface InitServerData {
  keyring: string;
  creds: WalletCredentials;
  env: Environ;
}

export interface Environ {
  WALLET_CREDS: string;
  CERE_BUCKET_ID: number;
  CERE_CLUSTER_ID: string;
  CERE_FOLDER: string;
} 