import { utils } from 'ethers';

import { Address, Bytes32, HexNumber } from './types';

// typescript tries to include this when using import and runs out of memory... this is a BIG file (~377Mb)
const importedProofs = require(`${process.cwd()}/proofs.json`);

export type Proof = Bytes32[];

export interface ProofNode {
  index: number;
  amount: HexNumber;
  proof: Proof;
  flags: {
    isSOCKS: boolean;
    isLP: boolean;
    isUser: boolean;
  };
}

export interface Proofs {
  merkleRoot: Bytes32;
  tokenTotal: HexNumber;
  claims: {
    [key: string]: ProofNode;
  };
}

const proofs: Proofs = importedProofs;

export const getProof = (address: Address): ProofNode => {
  const checksumAddress = utils.getAddress(address);
  const proofNode = proofs.claims[checksumAddress];

  return proofNode;
};

export const getProofClaimType = (proofNode: ProofNode): string => {
  switch (true) {
    case proofNode.flags.isUser:
      return 'user';

    case proofNode.flags.isLP:
      return 'liquidity-provider';

    case proofNode.flags.isSOCKS:
      return 'socks';
  }
};
