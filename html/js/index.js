const Screens = {
    Title: 0,
    ProblemSet: 1,
    Question: 2,
    Assignments: 3,
    SubScreen: 4,
};
window.Screens = Screens;
const SubScreens = {
    Settings: 0,
    Results: 1,
    Users: 2,
}
window.SubScreens = SubScreens;

const app = new Vue({
    el: "#MainLayout",
    data: {
        appName: "InquizIt",
        screen: Screens.Title,
        previousScreen: -1,
        subscreen: SubScreens.Settings,
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
            { icon: "house-fill", disabled: true, title: "Return to home screen.", value: "Title", options: {class:"icon-larger"} },
            { icon: "gear-fill", title: "Go to the setting screen.", value: "Settings", options:{class:"icon-larger"} },
        ],
        subIconGroup : [
            { icon : "arrow-left", title: "Return to previous screen.", value: "Back", options:{ class: "icon-larger" } },
            { icon : "gear-fill", title: "Goto setting screen.", value: SubScreens.Settings, options:{ class: "icon-larger", sticky: true, } },
            { icon : "clipboard", title: "Goto results screen.", value: SubScreens.Results, options:{ class: "icon-larger", sticky: true, } },
            { icon : "people-fill", title: "Goto users screen.", value: SubScreens.Users, options:{ class: "icon-larger", sticky: true, }},
        ],
        settings: {
            Questions : {
                "Progressbar Enabled"    : ["checkbox", true],
                "Progressbar Percentage" : ["checkbox", false],
            }
        },
        users: [],
        user: undefined,
        isFirstTime : undefined,
        hideWelcomeScreen : false,
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
        isSubScreen() {
            return this.screen == Screens.SubScreen;
        },
        shouldShowWelcomeScreen() {
            return !this.hideWelcomeScreen && this.isFirstTime != false;
        }
    },
    methods: {
        isThisSubScreen(name) {
            if(SubScreens[name] == undefined) return false;
            return (this.subscreen == SubScreens[name]);
        },
        mainIconGroupClick({event, icon}) {
            if(!icon["disabled"]) {
                if(icon["value"] == 'Title')
                    this.screenTransition(icon["value"]);
                else if(icon["value"] == 'Settings')
                    this.screenTransition(Screens.SubScreen, SubScreens.Settings);
            }
        },
        subIconGroupClick({event, icon}) {
            if(icon["value"] == 'Back') 
                this.screenTransition(this.previousScreen);
            else if(typeof(icon["value"]) == "number")
                this.subscreen = icon["value"];
        },
        screenTransition(screen, subscreen) {
            // Ensure we have the right kind of input.
            if (typeof screen == "string") screen = Screens[screen];
            if (typeof screen != "number") {
                console.warn(
                    `Invalid screen transition, must use either enum constant value from Screens constant, or a string that would be translated to one such constant.`
                );
                return;
            }
            if(typeof subscreen == "string") subscreen = SubScreens[subscreen];
            // If we don't have a subscreen
            if(screen != Screens.SubScreen)
                this.screen = screen;
            else if(typeof subscreen == "number") {
                this.subscreen = subscreen;
                this.screen = Screens.SubScreen;
                this.$refs.subnavbar.setSelected(this.subscreen);
            }
        },
        returnHome() {
            // Reset everything.
            this.selectedProblemSet.category = "";
            this.selectedProblemSet.subCategory = "";
            this.selectedProblemSet.questions = {};
            this.screenTransition(Screens.Title);
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
        openPackagesDir() {
            window.dialog.openPackagesDir();
        }
    },
    watch: {
        "selectedProblemSet.questions"(newValue) {
            // Select a random problem and pass it to the question screen.
            var i = Math.floor(Math.random() * newValue.length);
            this.$refs.Question.question = newValue[i];
        },
        user(newValue) {
            if(newValue == "Add User") {
                this.screenTransition(Screens.SubScreen, SubScreens.Users);
                this.user = "";
            }
        },
        screen(newValue, oldValue) {
            // Ensure we at the very least passed in a number (doesn't have to be valid).
            if(typeof(newValue) != "number") { this.screen = oldValue; return; }
            // Can't do anything if we are just setting to the same value.
            if(newValue == oldValue) return;
            // Cache our previous screen so that we can return back one screen.
            this.previousScreen = oldValue;
            // Ensure we have our home screen button enabled/disabled based on the screen we are on.
            if(newValue == Screens.Title) 
                this.mainIconGroup[0].disabled = true;
            else this.mainIconGroup[0].disabled = false;
            // Subscreens don't act as transitions instead they act as substitutes that can be undone at any point.
            if(newValue != Screens.SubScreen && oldValue != Screens.SubScreen) {
                // Notify our old screen and our new screen of our transition.
                for(const label in this.$refs) {
                    var id = Screens[label];
                    if(id != undefined) {
                        // Check if we found our transition to.
                        if(id == newValue) {
                            var screen = this.$refs[label];
                            if(screen.onTransitionIn) // Do we have a function to call?
                                screen.onTransitionIn();
                        }
                        // Otherwise check if we found our transition away.
                        else if(id == oldValue) {
                            var screen = this.$refs[label];
                            if(screen.onTransitionAway) // Do we have a function to call?
                                screen.onTransitionAway();
                        }
                    }
                }
            }
        },
    },
    created() {
        this.changeProblemSet("LogiCola");
    },
});