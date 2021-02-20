const esIndexManager = require('./esIndexManager');
const jsonDataLoader = require('./jsonDataLoader');

//Client Code

let indexManager = new esIndexManager("shows"); //index blog
importJsonData(); //read json file and add data to elastic-search

function importJsonData(){
    let document = jsonDataLoader.loadJsonFile('jsondata.json');
    // for (const key in document) {
    //     if (Object.hasOwnProperty.call(document, key)) {
    //         const elm = document[key];
    //         console.log(`key: ${key} elm: ${elm}`);
    //         indexManager.addDocument(key, 'posts', JSON.stringify(elm));
    //     }
    // }
    for (const doc in document) {
        // console.log('doc: ',doc);
        indexManager.addDocument(null, "posts", JSON.stringify(doc));
    }
}



function AddDocumentTest(){
//indexManager.createIndex(); //create Index

//Create an instance of Post
const newPost = new Post('Node with ES', "Article", "This is test post 1.");

//Conver to JSON
const jsonPost = JSON.stringify(newPost);
console.log(jsonPost);

//add to index
indexManager.addDocument('1', 'posts', jsonPost);
}

class Post {

    constructor(postName, postType, postContent) {
        this.postName = postName;
        this.postType = postType;
        this.postContent = postContent;
    }
}