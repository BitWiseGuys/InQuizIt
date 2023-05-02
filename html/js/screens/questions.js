/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the questions screen that will display each question for the user to answer.
 */

/**
 * HTML Tag: <v-questions-screen></v-questions-screen>
 */
Vue.component("vQuestionsScreen", {
    template: `
    <v-screen name="questions" class="no-center">
        <div class="main panel flex vertical">
            <div class="flex-stretch">
                <p class="margin-5">
                    <v-metatag :context="context" :text="q.content" ref="question" @answered="answeredQuestionWith"></v-metatag>
                </p>
            </div>
            <div class="flex-no-stretch flex margin-5">
                <input type="text" class="flex-stretch" placeholder="Enter answer here" v-model="answer" :disabled="continueQ">
                <v-group :direction="'horizontal'" class="flex-no-stretch" v-show="!continueQ">
                    <v-group-cell>
                        <v-icons class="smaller-icons" mode="select" @change="changeConfidence">
                            <v-icon icon="emoji-frown" title="Not confident" value="0"></v-icon>
                            <v-icon icon="emoji-neutral" title="Somewhat confident" value="1"></v-icon>
                            <v-icon icon="emoji-smile" title="Confident" value="2"></v-icon>
                        </v-icons>
                    </v-group-cell>
                    <v-group-cell>
                        <v-icons class="smaller-icons">
                            <v-icon icon="arrow-right" @click="verify()" :disabled="confidence < 0"></v-icon>
                        </v-icons>
                    </v-group-cell>
                </v-group>
                <v-group :direction="'horizontal'" class="flex-no-stretch" v-show="continueQ">
                    <v-group-cell>
                        <v-icons class="smaller-icons">
                            <v-icon :icon="correct ? 'check-square' : 'x-square'" @click="nextQuestion()">&nbsp;Next&nbsp;Question</v-icon>
                        </v-icons>
                    </v-group-cell>
                </v-group>
            </div>
        </div>
    </v-screen>
    `,
    data() {
        return {
            context: {},
            content: "",
            answer: "",
            q: {},
            progress: 0,
            max_score: 100,
            cached_answer_elm: undefined,
            confidence: -1,
            continueQ: false,
            correct: false,
        }
    },
    methods: {
        answeredQuestionWith(val, elm) {
            this.answer = val;
            if(this.cached_answer_elm) this.cached_answer_elm.classList.remove("active");
            this.cached_answer_elm = elm.parentElement;
            this.cached_answer_elm.classList.add("active");
        },
        verify() {
            if(this.q.answers) {
                var answers = this.answer.split(",");
                var all_found = [];
                var incorrect = false;
                for(var i in answers) {
                    var a = answers[i].toLowerCase();
                    var found = false; 
                    for(var j in this.q.answers) {
                        var b = String(this.q.answers[j]).toLowerCase();
                        if(b == a && all_found.indexOf(j) == -1) { found = true; all_found.push(j); break; }
                    }
                    if(!found) { incorrect = true; break; }
                }
                if(incorrect || all_found.length != this.q.answers.length) {
                    this.progress -= (this.confidence ? 10 * this.confidence : 0);
                    if(this.progress < 0) this.progress = 0;
                    this.correct = false;
                }
                else {
                    this.progress += (this.confidence ? 10 * this.confidence : 0);
                    if(this.progress > this.max_score) this.progress = this.max_score;
                    this.correct = true;
                }
                window.setScore(this.$root.user.first, this.$root.user.last, undefined, this.$root.selected_set[0], this.$root.selected_set[1], window.getOptions(), (this.progress / this.max_score) * 100);
                if(this.progress == this.max_score) this.$root.goto("results","default");
            }
            this.continueQ = true;
        },
        nextQuestion() {
            var q = window.selectNextQuestion();
            if(!q) return;
            this.q = q;
            this.context = {};
            this.answer = "";
            this.cached_answer_elm = undefined;
            this.$refs.question.refresh();
            this.continueQ = false;
        },
        changeConfidence(confidence) {
            this.confidence = confidence;
        },
        onTransitionAway(towards) {
            
        },
    }
});