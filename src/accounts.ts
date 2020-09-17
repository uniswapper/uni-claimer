import { Wallet } from 'ethers';

import {
  claimAddresses as providedClaimAddresses,
  ClaimSource,
  claimSource,
  claimSourceAccountNumberLimit,
  executorAccountNumber,
  ExecutorSource,
  executorSource,
} from './config';
import { Provider } from './network';
import { Address } from './types';

const executorMnemonic = process.env.EXECUTOR_MNEMONIC;
if (executorSource === ExecutorSource.Mnemonic && !executorMnemonic) {
  throw new Error('no .env value set for EXECUTOR_MNEMONIC');
}

const privateKey = process.env.EXECUTOR_PRIVATE_KEY;
if (executorSource === ExecutorSource.PrivateKey && !privateKey) {
  throw new Error('no .env value set for EXECUTOR_PRIVATE_KEY');
}

const claimMnemonic = process.env.CLAIM_MNEMONIC;
if (claimSource === ClaimSource.Mnemonic && !claimMnemonic) {
  throw new Error('no .env value set for EXECUTOR_PRIVATE_KEY');
}

if (!providedClaimAddresses && claimSource === ClaimSource.Manual) {
  throw new Error('no claimAddresses set in config.ts');
}

const getWalletFromMnemonic = (
  provider: Provider | null,
  mnemonic: string,
  level = 0
): Wallet => {
  const wallet = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${level}`);

  return provider ? wallet.connect(provider) : wallet;
};

const getAddressFromMnemonic = (mnemonic: string, level = 0): Address =>
  getWalletFromMnemonic(null, mnemonic, level).address;

const getWalletFromPrivateKey = (provider: Provider): Wallet => {
  const wallet = new Wallet(privateKey);

  return provider ? wallet.connect(provider) : wallet;
};

export const getExecutorWallet = (provider: Provider): Wallet => {
  switch (executorSource) {
    case ExecutorSource.PrivateKey:
      return getWalletFromPrivateKey(provider);
    case ExecutorSource.Mnemonic:
      return getWalletFromMnemonic(
        provider,
        executorMnemonic,
        executorAccountNumber
      );

    default:
      throw new Error('no ExecutorSource set in config.ts');
  }
};

const getClaimAddressesFromMnemonic = (): Address[] => {
  const addresses: Address[] = [];
  for (let i = 0; i < claimSourceAccountNumberLimit; i++) {
    addresses.push(getAddressFromMnemonic(claimMnemonic, i));
  }

  return addresses;
};

const getClaimAddressesFromConfig = (): Address[] => providedClaimAddresses;

export const getClaimAddresses = (): Address[] => {
  switch (claimSource) {
    case ClaimSource.Mnemonic:
      return getClaimAddressesFromMnemonic();

    case ClaimSource.Manual:
      return getClaimAddressesFromConfig();

    default:
      throw new Error('no claimSource set in config.ts');
  }
};
