import { $ } from '../utils';
import { readFile, readdir, writeFile } from 'fs/promises';
import { gt, inc } from 'semver';
import { Octokit } from '@octokit/rest';

export const getTagsFromGithub = async (): Promise<string[]> => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { owner, repo } = await getGitOwnerAndRepo();
  const response = await octokit.rest.repos.listTags({ owner, repo });
  return response.data.map((tag) => tag.name);
};

export const gitGetRemoteUrl = async () => {
  const remoteUrl = await $`git config --get remote.origin.url`;
  return remoteUrl;
};

export const getGitOwnerAndRepo = async () => {
  const remote = await gitGetRemoteUrl();
  const protocol = remote.split('://')[0];

  if (protocol === 'https') {
    const owner = remote.split('/')[3];
    const repo = remote.split('/')[4].split('.')[0];
    return { owner, repo };
  } else if (protocol === 'git@') {
    const owner = remote.split(':')[1].split('/')[0];
    const repo = remote.split(':')[1].split('/')[1].replace('.git', '');
    return { owner, repo };
  }

  throw new Error('Invalid remote url');
};

export const gitGetLatestCommitMsg = async () => {
  const output = await $`git show -s --format=%s`;
  return output.trim();
};

export const getTagsFromLocalGit = async () => {
  const tags = await $`git tag`;
  return tags.split('\n').filter((v) => !!v);
};

export const getTags = () => {
  if (process.env.GITHUB_ACTION) {
    return getTagsFromGithub();
  } else {
    return getTagsFromLocalGit();
  }
};

export const gitCommit = async (message: string) => {
  await $`git add .`;
  await $`git commit -m "${message}"`;
};

export const setNewTag = async (tag: string) => {
  await $`git tag ${tag}`;
  await $`git push origin ${tag}`;
};

export const getLatestVersionTag = async (tags?: string[]) => {
  tags = tags || (await getTags());
  return tags
    .filter((v) => v.match(/^v(\d+\.\d+\.\d+$)/)?.[1])
    .sort((a, b) => (gt(a, b) ? 1 : -1))
    .reverse()[0];
};

const readPackageJson = async () => {
  const dir = await readdir('.');
  if (!dir.includes('package.json')) {
    throw new Error('package.json not found');
  }
  const pkgJson = JSON.parse(await readFile('package.json', 'utf-8'));
  return pkgJson;
};

export const getVersionFromPackageJson = async (): Promise<
  string | undefined
> => {
  const pkgJson = await readPackageJson();
  return pkgJson?.version;
};

export const writeVersionToPackageJson = async (version: string) => {
  const pkgJson = await readPackageJson();
  pkgJson.version = version;
  await writeFile('package.json', JSON.stringify(pkgJson, null, 2));
};
