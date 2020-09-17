import { Address } from './types';

export enum ExecutorSource {
  PrivateKey,
  Mnemonic,
}

export enum ProviderSource {
  Local,
  External,
}

export enum ClaimSource {
  Manual,
  Mnemonic,
}

//
// user configuration goes here
//

// REQUIRED
export const executorSource: ExecutorSource = ExecutorSource.Mnemonic;

// only needed if executorSource is ExecutorSource.Mnemonic (accounts start at 0 and work their way up)
export const executorAccountNumber = 0;

// REQUIRED
export const providerSource: ProviderSource = ProviderSource.Local;

// only needed if providerSource is ProviderSource.Local
export const providerUrl = 'http://127.0.0.1:8545';

// REQUIRED
export const claimSource: ClaimSource = ClaimSource.Manual;

// only needed if claimSource is ClaimSource.Mnemonic (sets max number of accounts to try claiming from mnemonic)
export const claimSourceAccountNumberLimit = 10;

// only needed if claimSrouce is ClaimSource.Manual
export const claimAddresses: Address[] = [
  '0xffffffffffffffffffffffffffffffffffffffff',
  '0xdddddddddddddddddddddddddddddddddddddddd',
];

// gas price to pay in relation to current gas prices (ex 120 is 120% of current average gas price)
export const gasPricePercent = 100;

// log the retrieved proofs for each claim to terminal?
export const logProofs = false;
