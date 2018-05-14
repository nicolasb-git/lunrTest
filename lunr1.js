var fs = require("fs");
var lunr = require('lunr');



var documents = [];

var docsFolder = './docs/';


fs.readdirSync(docsFolder).forEach(file => {
    console.log("File " + file);
    var contenu = fs.readFileSync(docsFolder + file, "UTF-8");
    documents.push({"name" : file, "text" : contenu});
})


/*var documents = [{
    "name": "Lunr",
    "text": "Like Solr, but much smaller, and not as bright."
}, {
    "name": "React",
    "text": "A JavaScript library for building user interfaces."
}, {
    "name": "Lodash",
    "text": "A modern JavaScript utility library delivering modularity, performance & extras."
}]*/



var idx = lunr(function () {
    this.ref('name')
    this.field('text')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
})

var tab = idx.search("volume")

console.log(tab.length)

tab.forEach(function(item, index, array) {
    console.log(item.ref);
    console.log(item.score);
});


