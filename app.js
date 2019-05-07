import * as config from './config/config.json';
import { Models } from './modules.js';

console.log(config.appName);

const user1 = new Models.User();
const product1 = new Models.Product();