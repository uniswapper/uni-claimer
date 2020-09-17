const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const checkFileExists = location =>
  new Promise((resolve, reject) => {
    fs.access(location, fs.constants.F_OK, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

const main = async () => {
  const location = `${process.cwd()}/proofs.json`;

  const exists = await checkFileExists(location);
  if (exists) {
    console.log(chalk.green('proofs.json already fetched. skipping.'));

    return;
  }

  console.log(
    chalk.yellow('fetching proofs file... this might take some time...')
  );
  console.log(chalk.yellow('file size is more than 300MB...'));
  const { data: proofs } = await axios.get('https://mrkl.uniswap.org/');
  console.log(chalk.cyan('proofs file fetched.'));

  console.log(chalk.yellow('writing proofs file to disk'));

  fs.writeFileSync(location, JSON.stringify(proofs));

  console.log(chalk.cyan('proofs file written to disk'));

  console.log(chalk.magenta('all done'));
};

void main();
