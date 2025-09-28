#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Create version.json
const versionData = {
  version: packageJson.version
};

const versionJsonPath = path.join(__dirname, 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));

console.log(`Updated version.json with version ${packageJson.version}`);