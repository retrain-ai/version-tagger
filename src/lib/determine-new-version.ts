import { gt, inc } from 'semver';
import { logger } from '../logger';

import {
  getLatestVersionTag,
  getVersionFromPackageJson,
  gitGetLatestCommitMsg,
} from './lib';

export const determineNewVersion = async (): Promise<string | undefined> => {
  const lastMsg = await gitGetLatestCommitMsg();
  if (lastMsg.toLowerCase().includes('#no-bump')) {
    logger.info('Commit message contains #no-bump, skipping bump');
    return undefined;
  }

  const pkgJsonVersion = (await getVersionFromPackageJson()) || '0.0.1';
  const latestTagFromGit = await getLatestVersionTag();
  let newVersion: string | null;

  if (!latestTagFromGit) {
    newVersion = inc(pkgJsonVersion, 'patch');
  } else if (gt(pkgJsonVersion, latestTagFromGit)) {
    newVersion = pkgJsonVersion;
  } else {
    newVersion = inc(latestTagFromGit, 'patch');
  }

  if (!newVersion) {
    throw new Error(`Invalid old version ${pkgJsonVersion}`);
  }

  return newVersion;
};
