import * as _ from 'lodash';
const csv = require('csvtojson');
import { eventEmitter } from  './dirwatcher';

export class Importer {
    constructor() {
        eventEmitter.on('changed', (arrNewFiles) => {
            this.import(arrNewFiles).then((res) => {
                console.log(res);
            });
        });
    }

    import(files) {
        return new Promise((resolve, reject) => {
            _.forEach(files, (file) => {
                const pathToFile =__dirname + '/data/' + file;
                console.log(pathToFile);
                csv().fromFile(pathToFile)
                    .then((res) => {
                        resolve(res);
                    });
            });
        }).catch(() =>  console.log('Error with converting'));
    }

    // importSync(files) {
    //     _.forEach(files, (file) => {
    //         const pathToFile =__dirname + '/data/' + file;
    //         converter.fromFile(pathToFile)
    //             .on('end_parsed',function(jsonArrayObj){
    //                 // console.log(jsonArrayObj);
    //                 console.log('success');
    //                 return jsonArrayObj;
    //             })
    //             .on('done',(error) => {
    //                 if(error) {
    //                     console.log(error);
    //                     reject('Error with converting ' + pathToFile + '. ' + error);
    //                 }
    //             })
    //     })
    // }
}