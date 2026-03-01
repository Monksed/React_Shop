const fs = require('fs');
const path = require('path');

const version = Date.now().toString();

const versionJson = JSON.stringify({ version }, null, 2);
fs.writeFileSync(path.join(__dirname, '../build/version.json'), versionJson);

console.log(`✅ Сгенерирован новый version.json: ${version}`);
