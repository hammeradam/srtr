import path from 'path';
import { fileURLToPath } from 'url';

export const getDirName = () => path.dirname(fileURLToPath(import.meta.url))