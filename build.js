const {exec} = require('node:child_process');
const glob = require('glob')
const {promisify} = require('node:util')
const {basename} = require('node:path')
const {promises: fs} = require('node:fs')

function runCommand(command) {
    return promisify(exec)(command)
}

async function build() {
    await runCommand('tsc --project ./relative-import')
}

function wrapper(name, file) {
    return '' +
        `export function register${name}(System: SystemType) {
  ${file}
}`
}

async function generate() {
    const paths = await promisify(glob)("./relative-import/**/*.js");
    const files = await Promise.all(paths.map(path => fs.readFile(path).then(file =>
        (
            [basename(path), file.toString()]
        ))))

    const data = files.map(([name, file]) => {
        const fileName = name.slice(0, -3);
        const functionName = fileName.split('-').map((item) => `${item[0].toUpperCase()}${item.slice(1)}`).join('');
        const register = file.replace('System.register(', `System.register('${fileName}', `)
        return wrapper(functionName, register)
    }).join('\r\n');

    const content = '' +
        `// @ts-nocheck
import { System as SystemType } from "./amd";

${data}
`
    await fs.writeFile('./relative-import-data.ts', content);
}

async function main() {
    await build()
    await generate();
}

main();
