import {
  determineNewVersion,
  writeVersionToPackageJson,
  gitCommit,
  setNewTag,
} from './lib';
import { logger } from './logger';

export const inferVersion = async (options: {
  tag: boolean;
  writeToPkgJson: boolean;
  commit: boolean;
}) => {
  const newVersion = await determineNewVersion();

  if (!newVersion) {
    return;
  }

  logger.info(`New version: ${newVersion}`);

  if (options.writeToPkgJson) {
    await writeVersionToPackageJson(newVersion);
    logger.success('Wrote new version to package.json');
  }

  if (options.commit) {
    await gitCommit('chore: bump version ' + newVersion);
    logger.success('Committed new version');
  }

  if (options.tag) {
    await setNewTag('v' + newVersion);
    logger.success('Tagged new version');
  }
};
