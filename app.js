import * as config from './config/config.json';
import { Models } from './modules.js';
import { DirWatcher } from './dirwatcher';
import { Importer } from './importer';

// console.log(config.appName);

const user = new Models.User();
const product = new Models.Product();
const dirWatcher = new DirWatcher();
const importer = new Importer();
dirWatcher.watch('/data', 1000);