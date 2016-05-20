import task from './lib/task';
const test = process.argv.includes('test');
const production = process.argv.includes('production');

export default task(async function build() {
  await require('./clean')();
  await require('./copy')();
  await require('./bundle')();
});
