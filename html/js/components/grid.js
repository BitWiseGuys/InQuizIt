// Author: Andrew Kerr
// Date: 03/05/2023
// Description: An experimental system used to display a grid of elements.

// Example:
//   <v-grid :viewport="{width:'300px',height:'300px'}" :data="[{title:'Hello World', elements: [{tag:'button', group: 'a', value: 'a', text:'Click Me!'},{tag:'button', group: 'a', value: 'a', text:'No, Click Me!', events: {click: onClick}}] }]"></v-grid>

Vue.component("vGrid", {
    props: ["viewport", "data", "dimensions", "mapper"],
    template: `
    <div ref="grid"></div>
    `,
    data() {
        return {
            gridWidth: 0,
            gridHeight: 0,
            gridRowSize: 0,
            gridColSize: 0,
            gridData: [],
            gridSelected: {},
        }
    },
    methods: {
        refresh() {
            let self = this;
            // Locate our grid object.
            var grid = this.$refs.grid;
            if(!grid) { console.error("Wasn't able to find grid in our references!"); return; }
            // Clear our existing grid.
            this.gridSelected = {};
            grid.innerHTML = ""; //TODO: Should implement some sort of caching to better our refresh times.
            // Set our width and height and padding.
            grid.style["width"] = (this.gridWidth ? this.gridWidth : "inherit");
            grid.style["height"] = (this.gridHeight ? this.gridHeight : "inherit");
            grid.style["padding-left"] = "15px";
            grid.style["padding-right"] = "15px";
            grid.style["padding-top"] = "10px";
            grid.style["padding-bottom"] = "10px";
            // Ensure we have some data to process.
            if(!this.gridData || this.gridData.length == 0) return;
            // Calculate our working space.
            var nRowSize = (this.gridRowSize ? this.gridRowSize : 35);
            var nColSize = (this.gridColSize ? this.gridColSize : 125);
            var nMaxRows = Math.floor(grid.clientHeight / nRowSize);
            var nMaxCols = Math.floor(grid.clientWidth / nColSize);
            // Check that we have space for at least one row/column.
            if(!nMaxRows || !nMaxCols) {
                console.error(`No space for grid!\n\tMax Rows: ${nMaxRows}\n\tMax Cols: ${nMaxCols}\n\tClient Viewport: (${grid.clientWidth}, ${grid.clientHeight})`);
                return;
            }
            // console.log(`Generating grid:\n\tMax Rows: ${nMaxRows}\n\tMax Cols: ${nMaxCols}`);
            // PreGenerate our grid rows.
            for(var i = 0; i < nMaxRows; i++)
                grid.appendChild(document.createElement("tr")).style["height"] = nRowSize+"px";
            // Keep track of where we are processing.
            var nCurRow = 0;
            var nCurCol = 0;
            // Generate our grid.
            this.gridData.forEach((collection) => {
                // Check how many rows we will occupy (optional title plus optional elements).
                var nRows = (collection["title"] ? 1 : 0) + (collection["elements"] ? collection["elements"]["length"] : 0);
                // TODO: Check if we would like to split up our collection.
                // Process our title if we have one.
                if(collection["title"]) {
                    // Ensure we are within the correct boundary.
                    if(nCurRow >= nMaxRows){
                        nCurRow = 0;
                        nCurCol++;
                    }
                    // Create our element if it is valid.
                    var title = grid.children[nCurRow++].appendChild(document.createElement("td"));
                    title.style["text-align"] = "center";
                    title.style["max-height"] = nRowSize+"px";
                    var title = title.appendChild(document.createElement("h3"));
                    title.innerHTML = collection["title"];
                    title.style["max-height"] = nRowSize+"px";
                }
                // Process our elements if we have them.
                if(collection["elements"]){
                    collection["elements"].forEach((element) => {
                        // Ensure we are within the correct boundary.
                        if(nCurRow >= nMaxRows){
                            nCurRow = 0;
                            nCurCol++;
                        }
                        // Create our element if it has a tag.
                        if(element["tag"]) {
                            var _element = document.createElement(element["tag"]);
                            if(_element){
                                // Set the attributes for our element.
                                _element.innerHTML = (element["text"] ? element["text"] : "");
                                Object.keys(element).forEach((attr)=>{
                                    // Skip over the text attribute (since we had already set it).
                                    if(attr == "text") return;
                                    // Check if we are processing our functions instead.
                                    if(attr == "events") {
                                        let events = element[attr];
                                        Object.keys(events).forEach((fnName) => {
                                            let fnEvent = events[fnName];
                                            // Assign the event callback.
                                            if(typeof(fnName) == "string" && fnName.length && typeof(fnEvent) == "function")
                                                _element.addEventListener(fnName, fnEvent);
                                        });
                                    }
                                    // We might need 
                                    else if(attr == "group") {
                                        if(element["tag"] == "button") {
                                            _element.addEventListener("click", (event)=> {
                                                // Check if we are the selected element or not.
                                                var element = event.srcElement;
                                                var current = self.gridSelected[element.groupIdentifier];
                                                if(element && element != current) {
                                                    // Deselect our currently selected element.
                                                    if(current != undefined)
                                                        current.classList.remove("active");
                                                    // Select ourselves.
                                                    self.gridSelected[element.groupIdentifier] = element;
                                                    element.classList.add("active");
                                                }
                                            });
                                            _element.groupIdentifier = element["group"];
                                        }
                                    }
                                    // Otherwise we just set our attribute.
                                    else {
                                        // Set/remove attribute if the given value is valid or not.
                                        var value = element[attr];
                                        if(value)
                                            _element.setAttribute(attr, String(value));
                                        else _element.removeAttribute(attr);
                                    }
                                });
                                // Append the newly made elemnt into our grid.
                                var el = grid.children[nCurRow++].appendChild(document.createElement("td"));
                                el.style["text-align"] = "center";
                                el.style["width"] = nColSize+"px";
                                el.style["max-height"] = nRowSize+"px";
                                _element.style["max-height"] = nRowSize+"px";
                                el.appendChild(_element);
                            }
                        }
                    });
                }
            });
            if(nCurCol > nMaxCols) {
                console.warn("We exceeded the maximum number of columns!");
            }
        },
    },
    watch: {
        data(dt) {
            if(this.mapper && typeof(this.mapper) == "function")
                this.gridData = this.mapper(dt);
            else this.gridData = dt;
            this.refresh();
        },
        viewport(vp) {
            this.gridWidth = vp["width"] ? vp.width : 0;
            this.gridHeight = vp["height"] ? vp.height : 0;
            this.refresh(); 
        },
        dimensions(dim) {
            this.gridRowSize = Number(dim["row"] ? dim.row : 0);
            this.gridRowSize = Number(dim["col"] ? dim.col : 0);
            this.refresh();
        }
    },
    mounted() {
        // Get our viewport width and height and cache it.
        if(this.viewport && this.viewport.width) this.gridWidth = this.viewport.width;
        if(this.viewport && this.viewport.height) this.gridHeight = this.viewport.height;
        if(this.mapper && typeof(this.mapper) == "function")
            this.gridData = this.mapper(this.data);
        else this.gridData = this.data;
        this.refresh();
    }
});