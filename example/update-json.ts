import fs from 'fs';
import path from 'path';
import { hashElement } from 'folder-hash';

const run = async () => {
  const filePath = `${__dirname}/node_modules/@kingstinct/react-native-healthkit/package.json`;

  const text = fs.readFileSync(filePath, { encoding: 'utf8' });

  const json = JSON.parse(text);

  const version = json.version.split('-')[0];

  json.version = `${version}`;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), {
    encoding: 'utf8',
  });

  const { hash } = await hashElement(
    './node_modules/@kingstinct/react-native-healthkit',
    {
      folders: {
        exclude: [
          'node_modules',
          path.join(__dirname, '/src'),
          path.join(__dirname, '/lib'),
        ],
        matchBasename: true,
        // include: ['ios/**', 'android/**'],
      },
      // files: { include: ['ios/**.*', 'android/**.*'] },
    }
  );

  console.log('hash', hash);

  json.version = `${version}-${hash}`;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), {
    encoding: 'utf8',
  });
};

run();
