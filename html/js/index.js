const Screens = {
    Title: 0,
    ProblemSet: 1,
    Question: 2,
};

Vue.component("titleScreen", {
    template: `
    <div id="title">
        <h1>
            InquizIt
        </h1>
        <hr/>
        <div style="text-align:center;">
            <button>Assignments</button>
            <button @click="$root.screenTransition('ProblemSet')">Problem Sets</button>
        </div>
    </div>
    `,
});

{/* <template v-for="category, i in $root.problemSetGroup.categories">
                <h3 style="text-align:left;">{{category.title}}</h3>
                <div>
                    <template v-for="_, title in category.sets">
                        <button @click="setActive(title, i)" :class="{'active' : (active_set == title && active_category == i)}">{{title}}</button>
                    </template>
                </div>
            </template>
            <a :class="{'flow': true, 'active' : hasSelection}" @click="startQuestionSet()">Next >></a> */}

//<table id="problemSetTable"></table>

Vue.component("problemSetScreen", {
    template: `
    <div id="problemSet">
        <h2>{{$root.problemSetGroup.title}}</h2>
        <div ref="problemSetTable"></div>
    </div>
    `,
    data() {
        return {
            active_set: "",
            active_category: -1,
        };
    },
    computed: {
        hasSelection() {
            return this.active_set.length > 0 && this.active_category != -1;
        },
    },
    methods: {
        setActive(set, category) {
            this.active_set = set;
            this.active_category = category;
        },
        startQuestionSet() {
            // Prevent advancement without selected set.
            if (!this.hasSelection) return;
            // Set our root information.
            this.$root.selectedProblemSet.category =
                this.$root.problemSetGroup.categories[
                    this.active_category
                ].title;
            this.$root.selectedProblemSet.subCategory = this.active_set;
            this.$root.selectedProblemSet.questions =
                this.$root.problemSetGroup.categories[
                    this.active_category
                ].sets[this.active_set];
            // Reset our local information for the next time around.
            this.active_category = -1;
            this.active_set = "";
            this.$root.screenTransition(Screens.Question);
        },
        buildTable() {
            let self = this;
            var table = this.$refs.problemSetTable;
            table.innerHTML = ""; // Clear out previous children.
            this.active_category = "";
            this.active_set = "";

            var row_height = 40;//Pixels
            var column_width = 100;//Pixels
            var row_count = Math.floor(table.clientHeight / row_height);
            if(row_count == 0) {
                console.warn("Row count is equal to zero!!!");
                return;
            }
            console.log(`Row Height: ${row_height}; Client Height: ${table.clientHeight}; Row Count: ${row_count}`);
            //row_count = 10;
            var rows = [];
            for(var i = 0; i < row_count; i++)
                rows.push(table.appendChild(document.createElement("tr")));
            var columns = 1;
            var row = 0;
            this.$root.problemSetGroup.categories.forEach((category, index)=>{
                // Check to see if this category will be cutoff and give it the next row.
                var element_count = Object.keys(category.sets).length;
                if(element_count > row_count - row) {
                    row = 0;
                    columns++;
                }
                var title = rows[row++].appendChild(document.createElement("td"));
                var text = title.appendChild(document.createElement("h3"));// = `<h3>${category.title}</h3>`;
                text.innerHTML = category.title;
                text.style["max-height"] = row_height + "px";
                text.style["width"] = "100%";
                text.style["text-align"] = "center";
                Object.keys(category.sets).forEach((key)=>{
                    // Check if we need to advance to the next row.
                    if(row > row_count) {
                        row = 0;
                        columns++;
                    }
                    var element = rows[row++].appendChild(document.createElement("td"));
                    var button = element.appendChild(document.createElement("button"));
                    button.innerHTML = key;
                    button.setAttribute("category", index);
                    button.addEventListener('click', (event)=>{
                        let btn = event.target;
                        self.active_category = btn.getAttribute("category");
                        self.active_set = btn.innerHTML;
                    });
                    button.style["max-height"] = row_height + "px";
                    //button.style["width"] = "100%";
                });
            });
        }
    },
    // watch: {
    //     "$refs.problemSetTable.clientHeight"() {
    //         console.log("Height change!");
    //         this.buildTable();
    //     }
    // }
});

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
            question: {},
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
    },
    methods: {
        resetContent() {
            // TODO: Generate inner body.
            var temp = document.createElement("p");
            this.$refs.dynamicBody.append(temp);
            console.log(this.$refs.dynamicBody);
        },
    },
    watch: {
        question() {
            this.resetContent();
        },
    },
});

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
    },
    watch: {
        "selectedProblemSet.questions"(newValue) {
            // Select a random problem and pass it to the question screen.
            var i = Math.floor(Math.random() * newValue.length);
            this.$refs.question.question = newValue[i];
        },
        "problemSetGroup.categories"() {
            console.log(this.$refs);
            this.$refs.probleSets.buildTable();
        },
        screen(newValue) {
            if(newValue == Screens.ProblemSet) {
                Vue.nextTick(()=>{
                    this.$refs.probleSets.buildTable();
                }, this);
            }
        },
    },
    created() {
        this.changeProblemSet("LogiCola");
    },
});
