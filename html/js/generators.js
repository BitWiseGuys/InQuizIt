const firstnames = [
    "Andrew",
    "Grant",
    "Connor",
    "Phoenix",
    "Eddie",
];

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

window.generators = [
    window.CreateContentGenerator("gen-person", (cache, param)=>{
        return {
            firstname: pickRandom(firstnames)
        };
    }, undefined),
    window.CreateContentGenerator("gen-UniqueLetter", (cache, param)=>{
        var letters = [];
        for(var i in cache) letters.push(cache[i]);
        var letter;
        do {
            letter = String.fromCharCode('A'.charCodeAt(0)+Math.round(Math.random() * 26));
        } while(letters.indexOf(letter) != -1);
        return letter;
    }, undefined),
];