import del from 'del';
import task from './lib/task';
import fs from './lib/fs';

export default task(async function clean() {
  await del(['build/*'], { dot: true });
  await fs.mkdir('build');
});
