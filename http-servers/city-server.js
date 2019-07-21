const http = require('http');
const port = 3003;
const MongoClient = require('mongodb').MongoClient;

const server = http.createServer((req, res) => {

    MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
        if(err) {
            return console.dir(err);
        }
        let city = {
            name: "Minsk",
            country: "Belarus",
            capital: true,
            location: {
                lat: 4300000,
                long: 521111
            }
        };

        db.createCollection('cities', city, function(err, collection) {});

    });

    // const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    // mongoClient.connect(function(err, client){
    //     const db = client.db("nodedb");
    //     const collection = db.collection("cities");
    //     let city = {
    //         name: "Minsk",
    //         country: "Belarus",
    //         capital: true,
    //         location: {
    //             lat: 4300000,
    //             long: 521111
    //         }
    //     };
    //     collection.insertOne(user, function(err, result){
    //
    //         if(err){
    //             return console.log(err);
    //         }
    //         console.log(result.ops);
    //         client.close();
    //     });
    // });
}).listen(port);