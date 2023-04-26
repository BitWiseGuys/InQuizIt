// Source: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(matrix) {
    const rows = matrix.length,
        cols = matrix[0].length;
    const grid = [];
    for (let j = 0; j < cols; j++) {
        grid[j] = Array(rows);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[j][i] = matrix[i][j];
        }
    }
    return grid;
}

const app = new Vue({
    el: "#MainLayout",
    data: {
        appName: "Logicola",
        screen: "default",
        overlay: "default",
        users: [],
        user: undefined,
        login_firstname: "",
        login_lastname: "",
        package: { title: "", sets: {} },
        selected_set: [],
        set_options: [],
        databases: {},
        questionContext: {},
        questionContent: "",
        questionProgress: 0,
        questionAnswerInput: "",
        questionOptions: [],
        questionSelectedOptions: {},
    },
    computed: {
        isValidOptionSet() {
            // var a = [...new Set(this.questionSelectedOptions)].join(",");
            //return window.databases[this.package.title][this.selected_set[0]][this.selected_set[1]].indexOf("");
            return true;
        },
    },
    methods: {
        goto(screen, overlay) {
            if (screen && screen.length) this.screen = screen;
            if (overlay && overlay.length) this.overlay = overlay;
        },
        selectPackage(name) {
            this.package.title = name;
            this.refreshProblemSets();
        },
        refreshProblemSets() {
            if (this.package.title in this.databases)
                this.package.sets = this.databases[this.package.title];
            else this.package.sets = {};
        },
        selectQuestionSet(opts) {
            let self = this;
            if (
                !window.loadQuestionSet(
                    this.package.title,
                    this.selected_set[0],
                    this.selected_set[1]
                )
            )
                console.warn(
                    `Unable to load in the QuestionSet \"${this.package.title}\" \"${this.selected_set[0]}\" \"${this.selected_set[1]}\".`
                );
            if (!window.setOption(opts))
                console.warn(`Unable to set options \"${opts}\".`);
            window.loadQuestions().then(() => {
                self.questionProgress = -1;
                self.$refs.questions.nextQuestion(-1);
                self.$forceUpdate();
            });
        },
    },
    watch: {
        databases(newValue) {
            this.refreshProblemSets();
        },
        selected_set(newValue) {
            var opts = transpose(newValue[2]);
            for (var i in opts) {
                opts[i] = [...new Set(opts[i])];
            }
            this.questionOptions = opts;
        },
        screen(newValue, oldValue) {
            var newElement = undefined;
            var oldElement = undefined;
            for (var i in this.$children) {
                var child = this.$children[i];
                if (child.$children[0].$options._componentTag == "v-screen") {
                    if (child.$children[0].name == newValue) newElement = child;
                    if (child.$children[0].name == oldValue) oldElement = child;
                }
            }
            if (newElement == oldElement) return;
            // Try to transition to the next screen, allow the old screen to prevent a transition to occur.
            if (oldElement && oldElement.onTransitionAway) {
                if (oldElement.onTransitionAway(newElement) == false) {
                    this.screen = oldValue;
                    return;
                }
            }
            if (newElement && newElement.onTransitionInto)
                newElement.onTransitionInto();
        },
        overlay(newValue, oldValue) {
            var newElement = undefined;
            var oldElement = undefined;
            for (var i in this.$children) {
                var child = this.$children[i];
                if (child.$children[0].$options._componentTag == "v-overlay") {
                    if (child.$children[0].name == newValue) newElement = child;
                    if (child.$children[0].name == oldValue) oldElement = child;
                }
            }
            // Try to transition to the next screen, allow the old screen to prevent a transition to occur.
            if (oldElement && oldElement.onTransitionAway) {
                if (oldElement.onTransitionAway(newElement) == false) {
                    this.overlay = oldValue;
                    return;
                }
            }
            if (newElement && newElement.onTransitionInto)
                newElement.onTransitionInto();
        },
    },
    created() {
        // TODO: Needs to get stuff from the database.
        this.users = [
            { first: "Andrew", last: "Kerr" },
            { first: "Grant", last: "Duchars" },
        ];
        this.selectPackage("Logicola");
    },
});

window.context.root = app;
window.reloadDatabases();
