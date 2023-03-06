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

const peopleGenerator = window.CreateContentGenerator("person", CreatePerson, null);

//<div ref="dynamicBody"></div>
/**
 * <div>
            <p>
                <template v-for="text in question.body">
                    <v-metatag v-if="text != undefined" :text="text" :context="context"></v-metatag>
                    <br v-if="text == undefined"/>
                </template>
            </p>
        </div>
        <div>
            <template v-for="part in question.parts">
                <v-metatag v-if="part['body'] != undefined" :context="context">{{part['body']}}</v-metatag>
                <template v-if="part['type'] == 'input'">
                    <input v-model="part['answered']">
                </template>
            </template>
        </div>
 * 
 */

Vue.component("vQuestion", {
    template: `
    <div id="question">
        <h2>{{title}}</h2>
        <div>
            <v-icon-group ref="icons" :icons="toolbar" class="right"></v-icon-group>
        </div>
        <div>
            <p>
                <v-metatag :text="'This is a special kind of tag that allows for something like this, picking a first-name at random {person:0(first-name)}.'" :context="context"></v-metatag>
            </p>
        </div>
        <div>
            <v-icon-group id="confidence" :icons="confidence" class="right" @click="nextQuestion" :disabled="!isAnswered"></v-icon-group>
        </div>
    </div>
    `,
    data() {
        return {
            question: {},
            toolbar: [
                {icon: "question-circle-fill", title: "Gives a hint." },
                {icon: "arrow-right-circle-fill", title: "Skip this question." },
            ],
            confidence: [
                { icon: "0-circle" },
                { icon: "1-circle" },
                { icon: "2-circle" },
                { icon: "3-circle" },
                { icon: "4-circle" },
                { icon: "5-circle" },
                { icon: "6-circle" },
                { icon: "7-circle" },
                { icon: "8-circle" },
                { icon: "9-circle" },
            ],
            metadata: {},
            context: {
                generators: [peopleGenerator]
            },
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
        isAnswered() {
            if(this.question.parts){
                for(var i in this.question.parts) {
                    if(!this.question.parts[i].answered)
                        return false;
                }
            }
            return true;
        }
    },
    methods: {
        resetContent() {
            // let self = this;
            // // Clear out our previous question.
            // this.$refs.dynamicBody.innerHTML = "";
            // if(!this.question || !Object.keys(this.question).length) return; // Nothing to render?!
            // // Parse the given body so that we can build up our question.
            // if(this.question.body) {
            //     this.question.body.forEach((line)=>{
            //         var text = self.parse(line);
            //         this.$refs.dynamicBody.appendChild(document.createElement('p')).innerHTML = text;
            //     });
            // }
            // console.log(this.question,this.metadata);
            //this.$refs.dynamicBody.append(temp);
        },
        nextQuestion() {

        }
    },
    watch: {
        question() {
            this.resetContent();
        },
    },
});