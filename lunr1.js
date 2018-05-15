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
search("Cstings");

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

// do searches
search("rubber");
search("leuchars description screen");
search("pla*");
search("diagram^10 plane")
search("Cstings~1")
search("+safety -instructions")

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

function sort(table) {
    table.sort(function(a, b) {

        if (a.score > b.score) {
            return -1;
        } else if (a.score < b.score) {
            return 1;
        } else {
            return 0;
        }

    });
    return table;
}



function search(query) {
    console.log("*** Search '" + query + "' - start ******************************************************************")
    start = Date.now();
    var results = idx.search(query)
    millis = Date.now() - start;
    console.log("Search - end - " + millis)
    console.log("number of restults: " + results.length)
    results = sort(results);
    results.forEach(function(item, index, array) {
        console.log("score " + item.score + " - file " + item.ref);
    });
}