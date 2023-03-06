// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A screen that shows the current question to be answered.

const names = {
    first : [
        "Andrew", "Grant", "Eddie", "Phoenix", "Connor",
    ],
    last : [
        "Kerr", "Duchars", "Marshall", "Test", "Testing",
    ]
}

function CreatePerson() {
    var person = {};
    person["first-name"] = names.first[Math.floor(Math.random() * names.first.length)];
    person["last-name"] = names.last[Math.floor(Math.random() * names.last.length)];
    return person;
}

Vue.component("vQuestion", {
    template: `
    <div id="question">
        <h2>{{title}}</h2>
        <div><v-icon-group ref="icons" :icons="toolbar" class="right"></v-icon-group></div>
        <div ref="dynamicBody"></div>
    </div>
    `,
    data() {
        return {
            question: {},
            toolbar: [
                {icon: "question-circle-fill", title: "Gives a hint." },
                {icon: "arrow-right-circle-fill", title: "Skip this question." },
            ],
            metadata: {},
            answer: [],
        };
    },
    computed: {
        title() {
            return (
                this.$root.selectedProblemSet.category +
                " " +
                this.$root.selectedProblemSet.subCategory +
                (this.$root.selectedProblemSet.title.length
                    ? "; " + this.$root.selectedProblemSet.title
                    : "")
            );
        },
    },
    methods: {
        process(tag, id, attr) {
            // Check if we need to look in the answer unit.
            if(tag == "answer") {
                // answers must be indexed by a number.
                var index = Number(id);
                if(id.length && index != NaN)
                    return (this.answer[index] ? this.answer[index] : "''");
                return "''";
            }
            // Otherwise we look in our metadata section.
            else {
                if(tag == "person") {
                    var index = Number(id);
                    if(id.length && index != NaN) {
                        if(this.metadata) {
                            // Ensure we have an array of people.
                            if(!this.metadata["people"]) this.metadata["people"] = [];
                            // Check if we have the cached person, otherwise create one.
                            if(!this.metadata["people"][id])
                                this.metadata["people"][id] = CreatePerson();
                            // Return the specific attribute that was requested or convert it to a string, or we simply return the entire structure (todo: not a good idea to return the whole structure).
                            return (attr.length ? this.metadata["people"][id][attr] : (this.metadata["people"][id]["toString"] ? this.metadata["people"][id]["toString"]() : this.metadata["people"][id]));
                        }
                    }
                }
                else {
                    // Do we have metatable values to work with?
                    if(this.question.metadata) {
                        // Do we have an identifier that we can associate with this group?
                        if(id.length) {
                            // Ensure we have a space for this tag.
                            if(!this.metadata[tag]) this.metadata[tag] = {};
                            // Ensure we have a space for this id/tag.
                            if(!this.metadata[tag][id])  {
                                // Check if we can initialize it.
                                // if(this.question.metadata[tag] && this.question.metadata[tag][id]) 
                                this.metadata[tag][id] = this.question.metadata[tag][id];
                                // // Otherwise try to fallback to a default value.
                                // else if(this.question.metadata[tag]["default"]);
                                //     this.metadata[tag][id] = this.question.metadata[tag]["default"];
                                // Finally we can 'process' this if it has a special value.
                                if(this.metadata[tag][id] != undefined) {
                                    var value = this.metadata[tag][id];
                                    if(value.startsWith("range")) {
                                        value = value.substring(6, value.length - 1);
                                        var vals = value.split("-");
                                        if(vals.length >= 2) {
                                            vals[0] = Number(vals[0]);
                                            vals[1] = Number(vals[1]);
                                            console.log(vals);
                                            if(vals[0] && vals[1])
                                                this.metadata[tag][id] = Math.floor(Math.random() * (vals[1]-vals[0])) + vals[0];
                                        }
                                    }
                                }
                            }
                            // Return the value if we have one otherwise fallback to debug response.
                            if(this.metadata[tag][id])
                                return this.metadata[tag][id];
                        }
                        // Otherwise simple computed value.
                        else {
                            // Ensure we have an array of computed values to work with.
                            if(!this.metadata["computed"]) this.metadata["computed"] = [];
                            // Check if our value is contained in here.
                            if(!this.metadata["computed"][tag]) {
                                // Pick one at random.
                                if(this.question["metadata"][tag]) {
                                    // Pick randomly.
                                    var vals = this.question["metadata"][tag];
                                    this.metadata["computed"][tag] = vals[Math.floor(Math.random() * vals.length)];
                                }
                            }
                            // Return the value if we have one otherwise fallback to debug response.
                            if(this.metadata["computed"][tag])
                                return this.metadata["computed"][tag];
                        }
                    }
                }
                return "<"+tag+":"+id+"("+attr+")>";
            }
        },
        parse(line) {
            var string = "";
            var mode = 0; // 0: Normal, 1: Special Tag, 2: Identifier, 3: Attribute, 4: End tag
            var tag = "";
            var id = "";
            var attr = "";
            for(i in line) {
                var c = line[i];
                if(mode == 0) {
                    if(c == '{') {
                        mode = 1;
                        tag = "";
                        id = "";
                        attr = "";
                    }
                    else string += c;
                }
                else if(mode == 1) {
                    if(c == ':')
                        mode = 2;
                    else if(c == '}') {
                        mode = 0;
                        string += this.process(tag, id, attr);
                    }
                    else tag += c;
                }
                else if(mode == 2) {
                    if(c == '(')
                        mode = 3;
                    else if(c == '}') {
                        mode = 0;
                        string += this.process(tag, id, attr);
                    }
                    else id += c;
                }
                else if(mode == 3) {
                    if(c == ')') {
                        mode = 4;
                        string += this.process(tag, id, attr);
                    }
                    else attr += c;
                }
                else if(mode == 4) {
                    if(c == '}') {
                        mode = 0;
                    }
                }
            }
            return string;
        },
        resetContent() {
            let self = this;
            // Clear out our previous question.
            this.$refs.dynamicBody.innerHTML = "";
            if(!this.question || !Object.keys(this.question).length) return; // Nothing to render?!
            // Parse the given body so that we can build up our question.
            if(this.question.body) {
                this.question.body.forEach((line)=>{
                    var text = self.parse(line);
                    this.$refs.dynamicBody.appendChild(document.createElement('p')).innerHTML = text;
                });
            }
            console.log(this.question,this.metadata);
            //this.$refs.dynamicBody.append(temp);
        },
    },
    watch: {
        question() {
            this.resetContent();
        },
    },
});