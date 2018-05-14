var fs = require("fs");
var lunr = require('lunr');

// load contents in array
var documents = [];
var docsFolder = './docs/';
fs.readdirSync(docsFolder).forEach(file => {
    console.log("File " + file);
    var contenu = fs.readFileSync(docsFolder + file, "UTF-8");
    console.log(contenu)
    documents.push({"name" : file, "text" : contenu});
})

// index array
var idx = lunr(function () {
    this.ref('name')
    this.field('text')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
})

// do search
var tab = idx.search("volume")
console.log(tab.length)
tab.forEach(function(item, index, array) {
    console.log(item.ref);
    console.log(item.score);
});

// write indexes
fs.writeFile("idx.json", JSON.stringify(idx), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});


