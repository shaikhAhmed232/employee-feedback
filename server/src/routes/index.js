const {Router} = require("express");
const fs = require("node:fs");
const path = require("node:path");

const router = Router();
const currentDir = __dirname;

// Read all files in current directory
fs.readdirSync(currentDir)
  .filter(file => {
    // Filter out index.js and non-js files
    return (file.indexOf('.') !== 0) && 
           (file !== 'index.js') && 
           (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Create route path from filename (removing .js extension)
    const fileName = file.slice(0, -3)
    const routePath = `/${fileName}`;
    const routes = require(`./${fileName}`);
    router.use(routePath, routes);
  });

module.exports = router;
