# UNI token claim tool

## About

This tool claims UNI tokens for any addresses provided which have claims available.

It is useful for certain power users who do not want their accounts to touch metamask or other online things.

It is also useful for power users who have many trades on a single mnemonic. This tool can claim all of those
tokens for the given mnemonic.

## Usage

💀 **PLEASE READ EVERYTHING COMPLETELY AND CAREFULLY BEFORE TRYING TO RUN THE TOOL!!!** 💀

**THIS TOOL HAS NOT BEEN AUDITED OR REVIEWED BY ANYONE USE AT YOUR OWN RISK!!!**

**THIS TOOL IS PROVIDED AS IS AND I TAKE NO LIABILITY FOR LOST FUNDS!!!**

now that the danger/doom shouting is out of the way... lets see how to use the tool 😄

### Requirements

1. nodejs installed on computer
1. yarn package manager installed on computer
1. at least some knowledge on how to use a terminal

### Configuration

In order to run this tool, you need to set the appropriate values in the `.env` file as well as the `config.ts` file.

#### `.env` configuration

There is a `.env.example` file which can be used as a template. For convenience the example is shown here:

```sh
#
# account related
#

# only needed if not using EXECUTOR_PRIVATE_KEY
EXECUTOR_MNEMONIC="reform leisure weasel fever hire also trend grief man dial guard athlete"
# only needed if not using EXECUTOR_MNEMONIC
EXECUTOR_PRIVATE_KEY="0x0ab8338245c60ce0e35ce4a766f5f5c7568ad70062be9c51db4e8228add5d47a"
# only needed if claimAddresses not provided in config.ts
CLAIM_MNEMONIC="reform leisure weasel fever hire also trend grief man dial guard athlete"

#
# network related
#

# optional
ALCHEMY_API_TOKEN=
# optional
ETHERSCAN_API_TOKEN=
# optional
INFURA_API_TOKEN=
```

You will need to provide **EITHER** a private key or a mnemonic for the **executor**. The executor is the account which is
making the calls to the smart contract for all of these claimable addresses. With the way Uniswap has setup the claim process,
you do not need to claim FROM the account you are claiming for. You can call the contract from any address and claim on behalf
of the address you are calling the contract for. The tokens are still sent to the claim address (not necessarily the caller,
or executor).

If you are making MANY calls, you might want to consider adding in the option api keys in order to ensure that your calls do
get throttled. This is not strictly necessary though. If you are using your own local node, you do not need to worry about
this.

#### `config.ts` configuration

Non-private configuration details are kept in a dedicated config file found at `src/config.ts`. The default configuration is
shown below:

```typescript
...
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
```

There are three main values which need to be considered for how you want to make things work. These are each marked with
**REQUIRED**.

##### executorSource

This is the source of the account for the executor (explained above). It can be set to _ExecutorSource.PrivateKey_ or _ExecutorSource.Mnemonic_.

If you use _ExecutorSource.Mnemonic_ as the option, you can specify which account to use for the mnemonic. With the default settings, it
will use the first account in the mnemonic. The accounts start at 0. This means that 0 is the first account 1 is second etc...

If you use _ExecutorSource.PrivateKey_ no further configuration is required for the executorSource setting.

##### providerSource

The providerSource specifies how you are connecting to the blockchain. There are two options: _ProviderSource.Local_ and _ProviderSource.External_.

For most users, you will want to simply use the _ProviderSource.External_ option. This will automatically connect to an external provider
without any additional work or configuration needed.

For power users who are making many claims, you might want to consider adding api keys in the `.env` file (explained above).

For more technical users who are running their own node locally, you can use that node by using the _ProviderSource.Local_ option.

If you are using the _ProviderSource.Local_ option make sure to also set the **providerUrl** setting to the correct provider url.

##### claimSource

The **claimSource** is how you tell this program which addresses you want to try claiming tokens from. There are two options:
_ClaimSource.Manual_ and _ClaimSource.Mnemonic_.

The most simple option is _ClaimSource.Manual_ which will allow you to specify a list of addresses manually.

If you are using the _ClaimSource.Manual_ option, you must setthe addresses in **claimAddresses**. If you are not much of a programmer,
make sure that each address is surrounded by single quotes (') and followed by a comma (,). That would look something like this:

```typescript
export const claimAddresses: Address[] = [
  'address-one-goes-here',
  'address-two-goes-here',
  'etc...',
  'etc...',
];
```

The _ClaimSource.Mnemonic_ option will search through all of the addresses in a mnemonic that you provide up to a limit that you specify.

If you specify _ClaimSource.Mnemonic_, you need to set the **claimSourceAccountNumberLimit** setting. The default is 1, which means that it
will only check the first address in the mnemonic. Setting it to 100 will check the first 100 accounts from the mnemonic.

##### other settings

**logProofs** is probably not needed for anyone unless you are a technical person... in that case you already know what id does.

**gasPricePercent** allows you to set how high you are setting you gasPrice for these claim transactions. It does this in terms
of a percent of the current average gas price. 150 would mean 150% of the average gas price. 80 would be 80%.
**BE CAREFUL WITH THIS SETTING OR YOU MIGHT END UP NEEDING TO CANCEL A LOT OF TRANSACTIONS!!!**

### Building

Once you have read the above section and set everything to what you need, you need to build the project. This can be done
by using the following command:

```
yarn build
```

**WHENEVER YOU UPDATE THE `config.ts` FILE YOU NEED TO BUILD THE PROJECT AGAIN**

### Running

After you have configured the tool and run the build command, you can finally run the tool to make all of the claims.
This is done with the following command:

```
yarn claim
```
