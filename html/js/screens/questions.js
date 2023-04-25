Vue.component("vQuestionsScreen", {
    template: `
    <v-screen name="questions" class="no-center">
        <div class="main panel flex vertical">
            <div class="flex-stretch">
                <p>
                    <v-metatag :context="context" :text="content" ref="question" @answered="answeredQuestionWith"></v-metatag>
                </p>
            </div>
            <div class="flex-no-stretch flex margin-5">
                <input type="text" class="flex-stretch" placeholder="Enter answer here" v-model="answer">
                <v-group :direction="'horizontal'" class="flex-no-stretch">
                    <v-group-cell>
                        <v-icons class="smaller-icons" mode="select">
                            <v-icon icon="emoji-frown" title="Not confident" value="0"></v-icon>
                            <v-icon icon="emoji-neutral" title="Somewhat confident" value="1"></v-icon>
                            <v-icon icon="emoji-smile" title="Confident" value="2"></v-icon>
                        </v-icons>
                    </v-group-cell>
                    <v-group-cell>
                        <v-icons class="smaller-icons">
                            <v-icon icon="arrow-right" @click="nextQuestion(true)"><v-icon>
                        <v-icons>
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
            progress: 0,
            cached_answer_elm: undefined,
        }
    },
    methods: {
        answeredQuestionWith(val, elm) {
            this.answer = val;
            if(this.cached_answer_elm) this.cached_answer_elm.classList.remove("active");
            this.cached_answer_elm = elm.parentElement;
            this.cached_answer_elm.classList.add("active");
        },
        nextQuestion(isStart) {
            var q = window.selectNextQuestion();
            if(!q) return;
            this.content = q.content;
            this.context = {};
            this.answer = "";
            this.cached_answer_elm = undefined;
            this.$refs.question.refresh();
            this.progress++;
        },
        onTransitionAway(towards) {
            
        }
    }
});