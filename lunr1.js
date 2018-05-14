

var documents = [{
    "name": "Lunr",
    "text": "Like Solr, but much smaller, and not as bright."
}, {
    "name": "React",
    "text": "A JavaScript library for building user interfaces."
}, {
    "name": "Lodash",
    "text": "A modern JavaScript utility library delivering modularity, performance & extras."
}]

var lunr = require('lunr')

var idx = lunr(function () {
    this.ref('name')
    this.field('text')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
})

var tab = idx.search("bright")

console.log(tab.length)

tab.forEach(function(item, index, array) {
    console.log(item.ref);
    console.log(item.score);
    console.log(item.matchData.term);
    console.log(item.matchData.field);
});


