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

Vue.component("vQuestion", {
    template: `
    <div id="question">
        <h2>{{title}}</h2>
        <div>
            <v-progressbar v-if="$root.settings.Questions['Progressbar Enabled'][1]" style="display:inline-block;width:75%;min-width:200px;" :value="110" :max="100" :labeled="$root.settings.Questions['Progressbar Percentage'][1]"></v-progressbar>
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
                { icon: "emoji-frown-fill", title: "Not confident" },
                { icon: "emoji-neutral-fill", title: "Somewhat confident" },
                { icon: "emoji-smile-fill", title: "Confident"},
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
            // if(this.question.parts){
            //     for(var i in this.question.parts) {
            //         if(!this.question.parts[i].answered)
            //             return false;
            //     }
            // }
            return true;
        }
    },
    methods: {
        resetContent() {
            
        },
        nextQuestion() {

        },
        onTransitionIn() {

        }
    },
    watch: {
        question() {
            this.resetContent();
        },
    },
});