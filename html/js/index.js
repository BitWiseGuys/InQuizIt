const Screens = {
    Title: 0,
    ProblemSet: 1,
    Question: 2,
};
window.Screens = Screens;

const app = new Vue({
    el: "#MainLayout",
    data: {
        screen: Screens.Title,
        problemSetGroup: {
            title: "",
            categories: [],
        },
        selectedProblemSet: {
            category: "",
            subCategory: "",
            title: "",
            questions: {},
        },
        viewport : {
            width: 0,
            height: 0,
        },
        mainIconGroup : [
            { icon: "house-fill", disabled: true, title: "Return to home screen.", value: "Title" },
            { icon: "gear-fill", title: "Go to the setting screen.", value: "Settings" },
        ]
    },
    computed: {
        isTitleScreen() {
            return this.screen == Screens.Title;
        },
        isProblemSetScreen() {
            return this.screen == Screens.ProblemSet;
        },
        isQuestionScreen() {
            return this.screen == Screens.Question;
        },
    },
    methods: {
        mainIconGroupClick({event, icon}) {
            if(icon["value"] && !icon["disabled"])
                this.screenTransition(icon["value"]);
        },
        screenTransition(screen) {
            if (typeof screen == "string") screen = Screens[screen];
            if (typeof screen != "number") {
                console.warn(
                    `Invalid screen transition, must use either enum constant value from Screens constant, or a string that would be translated to one such constant.`
                );
                return;
            }
            this.screen = screen;
        },
        returnHome() {
            // Reset everything.
            this.selectedProblemSet.category = "";
            this.selectedProblemSet.subCategory = "";
            this.selectedProblemSet.questions = {};
            this.screenTransition(Screens.Title);
            this.screenTransition("test");
        },
        changeProblemSet(package) {
            // Attempt to load the package on our "server" side first.
            if (window.ProblemSets.load(package)) {
                this.problemSetGroup.title = package;
                this.problemSetGroup.categories = [
                    ...window.ProblemSets.categories(),
                ];
            }
        },
        onResize() {
            // if(this.$refs.probleSets)
            //     this.$refs.probleSets.onResize();
        },
    },
    watch: {
        "selectedProblemSet.questions"(newValue) {
            // Select a random problem and pass it to the question screen.
            var i = Math.floor(Math.random() * newValue.length);
            this.$refs.question.question = newValue[i];
        },
        "problemSetGroup.categories"() {
            console.log(this.$refs);
            //this.$refs.probleSets.buildTable();
        },
        screen(newValue) {
            // Ensure we have our home screen button enabled/disabled based on the screen we are on.
            if(newValue == Screens.Title) 
                this.mainIconGroup[0].disabled = true;
            else this.mainIconGroup[0].disabled = false;
        },
    },
    created() {
        this.changeProblemSet("LogiCola");
    },
});

window.addEventListener("resize", (event)=> {
    app.onResize();
});