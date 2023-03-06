// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A screen that shows all of the problem sets that we have.

/**
 * <v-grid-flexbox>
                <template v-for="category in $root.problemSetGroup.categories">
                    <div><h3>{{category.title}}</h3></div>
                    <div v-for="_, name in category.sets">
                        <button>{{name}}</button>
                    </div>
                </template>
            </v-grid-flexbox>
 * 
 */

Vue.component("problemSetScreen", {
    template: `
    <div id="problemSet">
        <h2>{{$root.problemSetGroup.title}}</h2>
        <div><v-icon-group ref="icons" :icons="options" @change="setMode" class="right"></v-icon-group></div>
        <div :class="mode">
            <template v-for="category, i in $root.problemSetGroup.categories">
                <h3><v-icon v-if="mode=='list'" class='icon-blank' :icon="isCollapsed(category.title) ? 'caret-right-fill' : 'caret-down'" @click="collapse(category.title)"></v-icon>{{category.title}}</h3>
                <div v-if="mode != 'list' || !isCollapsed(category.title)" v-for="_, name in category.sets">
                    <button :class="{active : (active_set == name && active_category == i)}" @click="setActive(name, i)">{{name}}</button>
                </div>
            </template>
        </div>
        <div><a :class="{'flow': true, 'float-right' : true, 'active': hasSelection}" @click="startQuestionSet">Next&nbsp;&gt;&gt;</a></div>
    </div>
    `,
    data() {
        return {
            active_set: "",
            active_category: -1,
            options: [
                {icon: "card-list", title: "A list of options", value: "list"},
                {icon: "grid-1x2-fill", title: "A grid of options", value: "grid"},
            ],
            mode: "list",
            expanded: [],
        };
    },
    computed: {
        hasSelection() {
            return this.active_set.length > 0 && this.active_category != -1;
        },
    },
    methods: {
        collapse(category) {
            if(this.expanded.includes(category))
                this.expanded.splice(this.expanded.indexOf(category), 1);
            else
                this.expanded.push(category);
        },
        isCollapsed(category) {
            return !this.expanded.includes(category);
        },
        setMode(mode) {
            this.mode = mode["value"];
        },
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
            this.$root.screenTransition(Screens.Question);
        },
        // Called when a screen transition goes from another screen to this screen.
        onTransitionIn() {
            // Reset our local info so we can start from scratch.
            this.active_category = -1;
            this.active_set = "";
            this.expanded = [];
        },
    },
});