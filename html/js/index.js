const Screens = {
	Title : 0,
    ProblemSet : 1,
    Question: 2,
}

Vue.component("titleScreen", {
    template:`
    <div id="title">
        <h1>
            InquizIt
        </h1>
        <button>Assignments</button>
        <button @click="$root.screenTransition('ProblemSet')">Problem Sets</button>
    </div>
    `
})

Vue.component("problemSetScreen", {
    template: `
    <div id="problemSet">
        <h2>{{$root.problemSetGroup.title}}</h2>
        <div id="problemSetTable">
            <template v-for="category, i in $root.problemSetGroup.categories">
                <h3 style="text-align:center;">{{category.title}}</h3>
                <template v-for="_, title in category.sets">
                    <button @click="setActive(title, i)" :class="{'active' : (active_set == title && active_category == i)}">{{title}}</button>
                </template>
            </template>
            <a :class="{'flow': true, 'active' : hasSelection}" @click="startQuestionSet()">Next >></a>
        </div>
    </div>
    `,
    data() {
        return {
            active_set : "",
            active_category : -1,
        };
    },
    computed: {
        hasSelection() {
            return this.active_set.length > 0 && this.active_category != -1;
        }
    },
    methods: {
        setActive(set, category) {
            this.active_set = set;
            this.active_category = category;
        },
        startQuestionSet() {
            // Prevent advancement without selected set.
            if(!this.hasSelection) return;
            // Set our root information.
            this.$root.selectedProblemSet.category = this.$root.problemSetGroup.categories[this.active_category].title;
            this.$root.selectedProblemSet.subCategory = this.active_set;
            this.$root.selectedProblemSet.questions = this.$root.problemSetGroup.categories[this.active_category].sets[this.active_set];
            // Reset our local information for the next time around.
            this.active_category = -1;
            this.active_set = "";
            this.$root.screenTransition(Screens.Question);
        }
    }
})

Vue.component("vQuestion", {
    template: `
    <div id="question">
        <h2>{{title}}</h2>
        <div class="toolbar"></div>
        <div ref="dynamicBody">

        </div>
    </div>
    `,
    data() {
        return {
            question : {}
        }
    },
    computed: {
        title() {
            return this.$root.selectedProblemSet.category + " " + this.$root.selectedProblemSet.subCategory
            + (this.$root.selectedProblemSet.title.length ? "; " + this.$root.selectedProblemSet.title : "");
        }
    },
    methods : {
        resetContent() {
            // TODO: Generate inner body.
            var temp = document.createElement("p");
            this.$refs.dynamicBody.append(temp);
            console.log(this.$refs.dynamicBody);
        }
    },
    watch: {
        "question"() {
            this.resetContent();
        }
    }
});

const app = new Vue({
    el: "#MainLayout",
    data: {
        screen: Screens.Title,
        problemSetGroup: {
            title: "",
            categories: []
        },
        selectedProblemSet : {
            category: "",
            subCategory : "",
            title: "",
            questions : {},
        },
    },
    computed: {
        isTitleScreen() { return this.screen == Screens.Title; },
        isProblemSetScreen() { return this.screen == Screens.ProblemSet; },
        isQuestionScreen() { return this.screen == Screens.Question; },
    },
    methods: {
        screenTransition(screen) {
            if(typeof(screen) == "string")
                screen = Screens[screen];
            if(typeof(screen) != "number") {
                console.warn(`Invalid screen transition, must use either enum constant value from Screens constant, or a string that would be translated to one such constant.`);
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
            if(window.ProblemSets.load(package)) {
                this.problemSetGroup.title = package;
                this.problemSetGroup.categories = [...window.ProblemSets.categories()];
            }
        },
    },
    watch: {
        'selectedProblemSet.questions'(newValue) {
            // Select a random problem and pass it to the question screen.
            var i = Math.floor(Math.random() * newValue.length);
            this.$refs.question.question = newValue[i];
        },
    },
    created() {
        this.changeProblemSet("LogiCola");
    }
});