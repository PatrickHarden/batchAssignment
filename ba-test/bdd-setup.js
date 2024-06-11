// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const dir = './reports';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
