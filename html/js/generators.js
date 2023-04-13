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
];