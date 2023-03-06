// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A screen that shows the current question to be answered.


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