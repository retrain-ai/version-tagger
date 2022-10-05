jest.mock('./lib');
import { determineNewVersion } from './determine-new-version';
import {
  getLatestVersionTag,
  getVersionFromPackageJson,
  gitGetLatestCommitMsg,
} from './lib';

describe('determineNewVersion', () => {
  it('should take version from pkgJson if no version from tags', () => {
    (getVersionFromPackageJson as jest.Mock).mockResolvedValue('1.0.0');
    (getLatestVersionTag as jest.Mock).mockResolvedValue(undefined);
    (gitGetLatestCommitMsg as jest.Mock).mockResolvedValue('some message');
    return expect(determineNewVersion()).resolves.toBe('1.0.1');
  });

  it('should take version from pkgJson if it is higher than tag version', () => {
    (getVersionFromPackageJson as jest.Mock).mockResolvedValue('1.0.0');
    (getLatestVersionTag as jest.Mock).mockResolvedValue('0.0.1');
    (gitGetLatestCommitMsg as jest.Mock).mockResolvedValue('some message');

    return expect(determineNewVersion()).resolves.toBe('1.0.0');
  });

  it('should bump version from tag if previous version exists', () => {
    (getVersionFromPackageJson as jest.Mock).mockResolvedValue('1.0.1');
    (getLatestVersionTag as jest.Mock).mockResolvedValue('1.1.2');
    (gitGetLatestCommitMsg as jest.Mock).mockResolvedValue('some message');

    return expect(determineNewVersion()).resolves.toBe('1.1.3');
  });

  it('should skip bump if last commit includes #no-bump', () => {
    (getVersionFromPackageJson as jest.Mock).mockResolvedValue('1.0.1');
    (getLatestVersionTag as jest.Mock).mockResolvedValue('1.1.2');
    (gitGetLatestCommitMsg as jest.Mock).mockResolvedValue(
      'some message #no-bump',
    );

    return expect(determineNewVersion()).resolves.toBe(undefined);
  });
});
