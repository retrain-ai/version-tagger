import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { inferVersion } from './main';

yargs(hideBin(process.argv))
  .command(
    '$0',
    'infer latest version from latest git tag',
    (yargs) => {
      return yargs
        .option('t', {
          alias: 'tag',
          demandOption: false,
          default: false,
          describe: 'tag the latest commit with the new version',
          type: 'boolean',
        })
        .option('w', {
          alias: 'write',
          demandOption: false,
          default: false,
          describe: 'write the new version to package.json',
          type: 'boolean',
        })
        .option('c', {
          alias: 'commit',
          demandOption: false,
          default: false,
          describe: 'commit the new version to package.json',
          type: 'boolean',
        });
    },
    async (argv) => {
      await inferVersion({
        commit: argv.c,
        tag: argv.t,
        writeToPkgJson: argv.w,
      });
    },
  )
  .help()
  .parse();
