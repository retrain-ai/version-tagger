import { exec } from 'shelljs';
//Replace this with zx once node is at version >= 16

const zipTemplateStrings = (
  strings: TemplateStringsArray,
  ...values: string[]
) => {
  return strings.reduce((acc, str, i) => {
    return acc + values[i - 1] + str;
  });
};

export const $ = async (command: TemplateStringsArray, ...args: any[]) => {
  const fullCommand = zipTemplateStrings(command, ...args);
  const output = exec(fullCommand);
  if (output.code !== 0) {
    throw new Error(`Command failed: ${fullCommand}, output: ${output.stderr}`);
  }
  return output.stdout;
};
