const { tsGenerator } = require('ts-generator');
const { TypeChain } = require('typechain/dist/TypeChain');
const chalk = require('chalk');

const main = async () => {
  try {
    const cwd = process.cwd();

    const preCompiledContracts = ['MerkleDistributor'];

    for (const contract of preCompiledContracts) {
      console.log(
        chalk.yellow(`creating type wrapper for contract: ${contract}...`)
      );

      await tsGenerator(
        { cwd },
        new TypeChain({
          cwd,
          rawConfig: {
            files: `./contract-abis/${contract}.json`,
            outDir: './typechain',
            target: 'ethers-v5',
          },
        })
      );

      console.log(chalk.cyan(`created type wrapper for contract: ${contract}`));
    }

    console.log(chalk.magenta('all contract type wrappers created'));
  } catch (err) {
    console.log(chalk.red(err));
    console.trace();
  }
};

main();
