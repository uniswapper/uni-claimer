import 'dotenv/config';

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { BigNumber } from 'ethers';

import { getClaimAddresses, getExecutorWallet } from './accounts';
import { logProofs } from './config';
import { getMerkleDistributor } from './contracts';
import { getProof, getProofClaimType, ProofNode } from './merkle-proofs';
import { getProvider } from './network';
import { Address } from './types';

type Claim = [Address, ProofNode];

const showDonation = async () =>
  new Promise(resolve => {
    chalkAnimation.neon('if you like this tool consider donating:');

    setTimeout(() => {
      console.log('0x28a21C1EC5cc6C167173B969AA99279ac930c2c3');
      resolve();
    }, 5000);
  });

const main = async () => {
  const provider = getProvider();
  const executor = getExecutorWallet(provider);
  const merkleDistributor = getMerkleDistributor(executor);
  const claimAddresses = getClaimAddresses();

  console.log(chalk.yellow(`using ${executor.address} as executor`));
  console.log(
    chalk.yellow(`using the following addresses will be checked for claims:`)
  );
  console.log(claimAddresses);

  console.log(chalk.yellow('getting proofs...'));
  const claims: Claim[] = [];
  for (const claimAddress of claimAddresses) {
    const proof = getProof(claimAddress);
    if (proof) {
      claims.push([claimAddress, proof]);

      console.log(
        chalk.cyan(
          `found a claim proof for ${claimAddress} for ${getProofClaimType(
            proof
          )}`
        )
      );

      if (logProofs) {
        console.log(proof);
      }
    }
  }

  console.log(
    chalk.cyan(`found ${claims.length} claim${claims.length > 1 ? 's' : ''}`)
  );

  console.log(
    chalk.bgYellow.black(
      'beginning claim process... this will likely take some time...'
    )
  );

  for (const [account, proofNode] of claims) {
    const { index, amount, proof } = proofNode;
    const avgGasPrice = await provider.getGasPrice();
    const gasPrice = BigNumber.from(avgGasPrice)
      .mul(150)
      .div(100);

    console.log(
      chalk.yellow(`performing claim on chain for address ${account}`)
    );

    const estimatedGas = await merkleDistributor.estimateGas.claim(
      index,
      account,
      amount,
      proof
    );
    const gasLimit = estimatedGas.mul(110).div(100);

    const claimed = await merkleDistributor.isClaimed(index);
    if (claimed) {
      console.log(
        chalk.red(
          `claim for address ${account} has already been claimed... skipping.`
        )
      );
    } else {
      await merkleDistributor.claim(index, account, amount, proof, {
        gasPrice,
        gasLimit,
      });

      console.log(chalk.yellow(`claim for address ${account} completed`));
    }
  }

  console.log(chalk.magenta('all claims completed!'));

  await showDonation();
};

void main();
