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
                        <v-icons class="smaller-icons">
                            <v-icon icon="emoji-frown" title="Not confident" @click="nextQuestion(0)" :disabled="answer.length == 0"></v-icon>
                            <v-icon icon="emoji-neutral" title="Somewhat confident" @click="nextQuestion(1)" :disabled="answer.length == 0"></v-icon>
                            <v-icon icon="emoji-smile" title="Confident" @click="nextQuestion(2)" :disabled="answer.length == 0"></v-icon>
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
            progress: 0,
            cached_answer_elm: undefined,
        };
    },
    methods: {
        answeredQuestionWith(val, elm) {
            this.answer = val;
            if (this.cached_answer_elm)
                this.cached_answer_elm.classList.remove("active");
            this.cached_answer_elm = elm.parentElement;
            this.cached_answer_elm.classList.add("active");
        },
        nextQuestion(lvl) {
            var q = window.selectNextQuestion();
            if (!q) return;
            // Temporary override for demo
            if (lvl == 4)
                this.content =
                    "This is a test question that take advantage of the [selectable] text feature along with the ability to generate content\n{gen-UniqueLetter:1}, {gen-UniqueLetter:2}, {gen-UniqueLetter:3}, {gen-UniqueLetter:4} {image:https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/SMPTE_Color_Bars.svg/200px-SMPTE_Color_Bars.svg.png} {diagram:3-venn}";
            else this.content = q.content;
            this.context = {};
            this.answer = "";
            this.cached_answer_elm = undefined;
            this.$refs.question.refresh();
            this.progress++;
        },
        onTransitionAway(towards) {
            if (towards == this) return true;
            return false;
        },
    },
});
