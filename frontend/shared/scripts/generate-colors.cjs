require('ts-node').register({
    skipProject: true,
    transpileOnly: true,
    compilerOptions: {
        module: 'Node16',
        moduleResolution: 'Node16'
    }
});

const {mkdirSync, writeFileSync} = require('node:fs');
const {dirname, resolve} = require('node:path');

const {buildPocketPilotMobileGlobalCss, buildPocketPilotWebColorCss} = require('../colors.ts');

const frontendRoot = resolve(__dirname, '..', '..');

const outputs = [
    {
        path: resolve(frontendRoot, 'web', 'src', 'styles', 'generated-colors.css'),
        content: buildPocketPilotWebColorCss()
    },
    {
        path: resolve(frontendRoot, 'mobile', 'src', 'global.css'),
        content: buildPocketPilotMobileGlobalCss()
    }
];

for (const output of outputs) {
    mkdirSync(dirname(output.path), {recursive: true});
    writeFileSync(output.path, output.content);
}
