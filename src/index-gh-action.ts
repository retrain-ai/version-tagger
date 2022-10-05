import * as core from '@actions/core';
import { inferVersion } from './main';
const tag = core.getBooleanInput('tag');
const write = core.getBooleanInput('write');
const commit = core.getBooleanInput('commit');

inferVersion({ commit, tag, writeToPkgJson: write }).catch((error) => {
  core.setFailed(error.message);
});
