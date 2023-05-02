/**
 * A collection of firstnames for the generator to use.
 */
const firstnames = [
    "Andrew",
    "Grant",
    "Connor",
    "Phoenix",
    "Eddie",
];

/**
 * Picks a random element from the given array.
 * @param {Array} array The array that will have a random element picked from it.
 * @returns {*} The randomly picked element in the array that has been returned.
 */
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * An array of generator objects.
 */
window.generators = [
    // Creates a content generator named 'gen-person' and generates people objects.
    window.CreateContentGenerator("gen-person", (cache, param)=>{
        return {
            firstname: pickRandom(firstnames)
        };
    }, undefined),
    // Creates a content generator named 'gen-UniqueLetter' and generates a unique letter (unique to the given cache).
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

/**
 * An object whose keys identify what diagram name we have and whose values are functions that generate the diagram.
 */
window.diagrams = {
    // Generates a 3 circle venn diagram and sets it up for interaction.
    "3-venn" : (canvas, params) => {
        var winMin = Math.min(canvas.clientWidth, canvas.clientHeight);
        canvas.width = winMin;
        canvas.height = winMin;

        var ctx = canvas.getContext('2d');
        var circle = (x, y, r) => {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            ctx.stroke();
        }
        // Draw the venn diagram...
        circle(canvas.width / 3, canvas.height / 3, winMin / 4);
        circle(canvas.width / 3 * 2, canvas.height / 3, winMin / 4);
        circle(canvas.width / 2, canvas.height / 3 * 2, winMin / 4);

        canvas.addEventListener("click", function(e) {
            
        });
    }
}