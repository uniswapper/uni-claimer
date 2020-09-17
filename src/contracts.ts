import { Contract, Signer } from 'ethers';

import merkleDistributorAbi from '../contract-abis/MerkleDistributor.json';
import { MerkleDistributor } from '../typechain/MerkleDistributor';

const merkleDistributorAddress = '0x090d4613473dee047c3f2706764f49e0821d256e';

export const getMerkleDistributor = (signer: Signer): MerkleDistributor =>
  new Contract(
    merkleDistributorAddress,
    merkleDistributorAbi,
    signer
  ) as MerkleDistributor;
