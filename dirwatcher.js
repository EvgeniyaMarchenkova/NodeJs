import * as fs from 'fs';
import { EventEmitter } from 'events';
import * as _ from 'lodash';

const eventEmitter = new EventEmitter();

module.exports.eventEmitter = eventEmitter;
export class DirWatcher {
    listOfFiles = [];
    constructor() {}

    watch(path, delay) {
        const fullPath = __dirname + path;
        setInterval(() => {
            fs.readdir(fullPath, (err, list) => {
                if (err) {
                    console.log('Error reading directory ' + path);
                    console.log(err);
                    return;
                }
                if (!_.isEqual(this.listOfFiles, list)) {
                    const newFiles = _.difference(list, this.listOfFiles);
                    eventEmitter.emit('changed', newFiles);
                }
                this.listOfFiles = list;
            })
        }, delay);
    }
}