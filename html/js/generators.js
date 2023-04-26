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

window.diagrams = {
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