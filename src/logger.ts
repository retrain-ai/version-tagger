import chalk from 'chalk';
export const logger = {
  log: (msg: string) => {
    console.log(msg);
  },
  debug: (msg: string) => {
    console.log('DEBUG: ' + msg);
  },
  info: (msg: string) => {
    console.log(chalk.greenBright(msg));
  },
  success(msg: string) {
    console.log(chalk.green(msg));
  },
  error(msg: string) {
    console.error(chalk.red(msg));
  },
};
