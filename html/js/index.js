/**
 * Author: Andrew Kerr
 * Description: The main Vue root component, the basics of the application. 
 */

/**
 * Transposes a given matrix.
 * @param {Array<Array<*>>} matrix A matrix of objects that will be transposed. 
 * @returns The transposed matrix.
 */
function transpose(matrix) {
    const rows = matrix.length, cols = matrix[0].length;
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

/**
 * Creates the root component for our app.
 */
const app = new Vue({
    el: "#MainLayout",
    data: {
        appName: "Logicola+",
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
        QDescription: "",
    },
    computed: {
        isValidOptionSet() {
            // var a = [...new Set(this.questionSelectedOptions)].join(",");
            //return window.databases[this.package.title][this.selected_set[0]][this.selected_set[1]].indexOf("");
            return true;
        }
    },
    methods: {
        /**
         * Navigates the user to a particular screen or overlay.
         * @param {String} screen An optional screen name to navigate to.
         * @param {String} overlay An optional overlay name to navigate to.
         */
        goto(screen, overlay) {
            if(screen && screen.length) this.screen = screen;
            if(overlay && overlay.length) this.overlay = overlay;
        },
        /**
         * Selects a particular package.
         * @param {String} name The name of the package to select. 
         */
        selectPackage(name) {
            this.package.title = name;
            this.refreshProblemSets();
        },
        /**
         * Refreshes the underlying package sets to match the selected set.
         */
        refreshProblemSets() {
            if(this.package.title in this.databases)
                this.package.sets = this.databases[this.package.title];
            else this.package.sets = {};
        },
        /**
         * Selects a particular question set using the given options.
         * @param {Array<String>} opts An array of option strings.
         */
        selectQuestionSet(opts) {
            let self = this;
            if(!window.loadQuestionSet(this.package.title, this.selected_set[0], this.selected_set[1]))
                console.warn(`Unable to load in the QuestionSet \"${this.package.title}\" \"${this.selected_set[0]}\" \"${this.selected_set[1]}\".`);
            if(!window.setOption(opts))
                console.warn(`Unable to set options \"${opts}\".`);
            window.loadQuestions().then(()=>{
                self.questionProgress = -1;
                self.$refs.questions.nextQuestion(-1);
                self.$forceUpdate();
            });
        },
    },
    watch: {
        /**
         * Watches the databases member and is invoked upon its change.
         * @param {*} newValue The new value of the member variable.
         */
        databases(newValue) {
            this.refreshProblemSets();
        },
        /**
         * Watches the selected_set member and is invoked upon its change.
         * @param {*} newValue The new value of the member variable.
         */
        selected_set(newValue) {
            var opts = transpose(newValue[2]);
            for(var i in opts) {
                opts[i] = [...new Set(opts[i])];
            }
            this.questionOptions = opts;
        },
        /**
         * Watches the screen member and is invoked upon its change.
         * @param {*} newValue The new value of the member variable.
         * @param {*} oldValue The old value of the member variable.
         */
        screen(newValue, oldValue) {
            var newElement = undefined;
            var oldElement = undefined;
            for(var i in this.$children) {
                var child = this.$children[i];
                if(child.$children[0].$options._componentTag == "v-screen"){
                    if(child.$children[0].name == newValue) newElement = child;
                    if(child.$children[0].name == oldValue) oldElement = child;   
                }
            }
            if(newElement == oldElement) return;
            // Try to transition to the next screen, allow the old screen to prevent a transition to occur.
            if(oldElement && oldElement.onTransitionAway) {
                if(oldElement.onTransitionAway(newElement) == false) { this.screen = oldValue; return; };
            }
            if(newElement && newElement.onTransitionInto) newElement.onTransitionInto();
        },
        /**
         * Watches the screen member and is invoked upon its change.
         * @param {*} newValue The new value of the member variable.
         * @param {*} oldValue The old value of the member variable.
         */
        overlay(newValue, oldValue) {
            var newElement = undefined;
            var oldElement = undefined;
            for(var i in this.$children) {
                var child = this.$children[i];
                if(child.$children[0].$options._componentTag == "v-overlay"){
                    if(child.$children[0].name == newValue) newElement = child;
                    if(child.$children[0].name == oldValue) oldElement = child;   
                }
            }
            // Try to transition to the next screen, allow the old screen to prevent a transition to occur.
            if(oldElement && oldElement.onTransitionAway) {
                if(oldElement.onTransitionAway(newElement) == false) { this.overlay = oldValue; return; };
            }
            if(newElement && newElement.onTransitionInto) newElement.onTransitionInto();
        }
    },
    created() {
        this.selectPackage("Logicola");
    },
});

window.context.root = app;
window.reloadDatabases();