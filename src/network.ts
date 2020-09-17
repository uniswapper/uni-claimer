import chalk from 'chalk';
import { ethers, getDefaultProvider, providers } from 'ethers';

import { ProviderSource, providerSource, providerUrl } from './config';

if (providerSource === ProviderSource.Local && !providerUrl) {
  console.log(
    chalk.yellow(
      'no .env value set for PROVIDER_URL. external provider will be used.'
    )
  );
}

const alchemyApiToken = process.env.ALCHEMY_API_TOKEN;
if (providerSource === ProviderSource.External && !alchemyApiToken) {
  console.log(
    chalk.yellow(
      'no .env value set for ALCHEMY_API_TOKEN. requests might be slow and/or throttled.'
    )
  );
}

const etherscanApiToken = process.env.ETHERSCAN_API_TOKEN;
if (providerSource === ProviderSource.External && !etherscanApiToken) {
  console.log(
    chalk.yellow(
      'no .env value set for ETHERSCAN_API_TOKEN. requests might be slow and/or throttled.'
    )
  );
}

const infuraApiToken = process.env.INFURA_API_TOKEN;
if (providerSource === ProviderSource.External && !infuraApiToken) {
  console.log(
    chalk.yellow(
      'no .env value set for INFURA_API_TOKEN. requests might be slow and/or throttled.'
    )
  );
}

export type Provider = providers.Provider;

const getExternalProvider = (): Provider =>
  getDefaultProvider('mainnet', {
    alchemy: alchemyApiToken,
    etherscan: etherscanApiToken,
    infura: infuraApiToken,
  });

const getOwnProvider = (): Provider =>
  new ethers.providers.JsonRpcProvider(providerUrl);

export const getProvider = (): Provider =>
  providerUrl ? getOwnProvider() : getExternalProvider();
