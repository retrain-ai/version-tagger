import os from 'os';
import { $ } from '../utils';
import {
  getLatestVersionTag,
  getTags,
  getVersionFromPackageJson,
  writeVersionToPackageJson,
  gitCommit,
} from './lib';
import { cd, exec, mkdir, rm } from 'shelljs';

const TMP_DIR = os.platform() === 'linux' ? '/dev/shm' : os.tmpdir();
const originalDir = process.cwd();

const setupDir = () => {
  const dir = `${TMP_DIR}/test-${Math.random()}`;
  mkdir('-p', dir);
  cd(dir);
  $`git init`;
  return dir;
};

const cleanupDir = (dir: string) => {
  cd(originalDir);
  rm('-rf', dir);
};

describe('lib', () => {
  describe('-- fs related --', () => {
    let workingDir: string;
    beforeEach(() => {
      workingDir = setupDir();
    });

    afterEach(() => {
      cleanupDir(workingDir);
    });

    describe('tags', () => {
      it('should return an empty array when no tags exist', async () => {
        const tags = await getTags();
        expect(tags).toEqual([]);
      });

      it('should return a list of tags when multiple exists', async () => {
        $`touch a`;
        $`git add a`;
        $`git commit -m "first"`;
        $`git tag v1.0.0`;
        $`touch b`;
        $`git add b`;
        $`git commit -m "second"`;
        $`git tag v2.0.0`;

        const tags = await getTags();
        expect(tags).toEqual(['v1.0.0', 'v2.0.0']);
      });
    });

    describe('package.json handling', () => {
      it('should read version from package.json', () => {
        $`echo '{"version": "1.0.0"}' > package.json`;
        expect(getVersionFromPackageJson()).resolves.toBe('1.0.0');
      });

      it('should write version to package.json', async () => {
        $`echo '{"version": "1.0.0"}' > package.json`;
        await writeVersionToPackageJson('2.0.0');
        expect(getVersionFromPackageJson()).resolves.toBe('2.0.0');
      });
    });
  });

  describe('getLatestVersionTag', () => {
    it('should get latest version', async () => {
      const latest = await getLatestVersionTag(['v1.0.0', 'v2.0.0']);
      expect(latest).toEqual('v2.0.0');
    });
    it('should not rely on order', async () => {
      const latest = await getLatestVersionTag([
        'v1.0.1',
        'v1.0.11',
        'just a random tag',
      ]);
      expect(latest).toEqual('v1.0.11');
    });
  });
});
