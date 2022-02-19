const execSync = require('child_process').execSync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

let hash = 'development build';
let licenses = 'placeholder for open source licenses\n';

if (process.argv.length > 2 && process.argv[2] === 'build') {
  if (process.env.NOW_GITHUB_COMMIT_SHA !== undefined) {
    // zeit CI
    hash = process.env.NOW_GITHUB_COMMIT_SHA;
  } else if (process.env.TRAVIS_COMMIT !== undefined) {
    // Travis CI
    hash = process.env.TRAVIS_COMMIT;
  } else if (process.env.GITHUB_SHA !== undefined) {
    // GitHub Actions
    hash = process.env.GITHUB_SHA;
  } else {
    hash = execSync('git rev-parse HEAD').toString().replace('\n', '');
  }

  // build licenses file
  licenses = 'ficsit-felix (https://github.com/ficsit-felix/ficsit-felix)\n\n';
  licenses += readFileSync('../LICENSE');
  licenses +=
    '\n-----\n\nThe low poly 3d models were created by Cale Flanagan, CVex2150J and bitowl and are distributed under the Creative Commons Attribution-ShareAlike 4.0 International license:\n\n';
  licenses += readFileSync('public/models/LICENSE');
  licenses += '-----\n\n';
  licenses += execSync('yarn licenses generate-disclaimer --silent', {
    maxBuffer: 10000000,
  }).toString();
}

writeFileSync(
  'src/lib/core/commithash.ts',
  "const commithash = '" + hash + "';\nexport { commithash };\n"
);
writeFileSync('public/licenses.txt', licenses);
