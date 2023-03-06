// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A screen that shows all of the problem sets that we have.

Vue.component("problemSetScreen", {
    template: `
    <div id="problemSet">
        <h2>{{$root.problemSetGroup.title}}</h2>
        <v-grid-flexbox>
            <template v-for="category in $root.problemSetGroup.categories">
                <div><h3>{{category.title}}</h3></div>
                <div v-for="_, name in category.sets">
                    <button>{{name}}</button>
                </div>
            </template>
        </v-grid-flexbox>
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
    },
    // watch: {
    //     "$refs.problemSetTable.clientHeight"() {
    //         console.log("Height change!");
    //         this.buildTable();
    //     }
    // }
});