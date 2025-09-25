const fs = require('fs');
const { execSync } = require('child_process');

const folders = [
  'src',
  'src/controllers',
  'src/models',
  'src/routes',
  'src/middlewares',
  'src/services',
  'src/data'
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Dossier créé : ${folder}`);
  }
});


fs.writeFileSync('src/data/db.json', '{}');


execSync('npm init -y', { stdio: 'inherit' });


execSync('npm install express', { stdio: 'inherit' });

execSync('npm install typescript ts-node-dev @types/node @types/express --save-dev', { stdio: 'inherit' });

execSync('npx tsc --init' , { stdio: 'inherit' })

console.log('Projet initialisé avec Express.');