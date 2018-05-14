var fs = require("fs");
var lunr = require('lunr');

// load contents in array
var documents = [];
var docsFolder = './docs/';
fs.readdirSync(docsFolder).forEach(file => {
    //console.log("File " + file);
    var contenu = fs.readFileSync(docsFolder + file, "UTF-8");
    contenu = stripTags(contenu); // clean xml tags
    //console.log(contenu)
    documents.push({"name" : file, "text" : contenu});
})

// index array
console.log("Indexing - start")
var start = Date.now();
var idx = lunr(function () {
    this.ref('name')
    this.field('text')
    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
})
var millis = Date.now() - start;
console.log("Indexing - end - " + millis)
// do search
console.log("Search - start")
start = Date.now();
var tab = idx.search("accidentally")
millis = Date.now() - start;
console.log("Search - end - " + millis)
console.log(tab.length)
console.log("Search results");
tab.forEach(function(item, index, array) {
    console.log("file " + item.ref);
    console.log("score " + item.score);
});

// write indexes
const json1 = "idx.json";
console.log("Write indexes - start")
fs.writeFileSync("idx.json", JSON.stringify(idx));

console.log("Write indexes - end")

// read indexes
var json = fs.readFileSync(json1, "UTF-8");
console.log("Read indexes - start")
start = Date.now();
idx = lunr.Index.load(JSON.parse(json))
millis = Date.now() - start;
console.log("Read indexes - end - " + millis)



function stripTags(html) {
//PROCESS STRING
    if(arguments.length < 3) {
        html=html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
        var allowed = arguments[1];
        var specified = eval("["+arguments[2]+"]" );
        if(allowed){
            var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
            html=html.replace(new RegExp(regex, 'gi'), '');
        } else{
            var regex='</?(' + specified.join('|') + ')\b[^>]*>';
            html=html.replace(new RegExp(regex, 'gi'), '');
        }
    }
//CHANGE NAME TO CLEAN JUST BECAUSE
    var clean_string = html;
//RETURN THE CLEAN STRING
    return clean_string;
}


