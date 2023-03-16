Vue.component("vProgressbar", {
    props: ["max", "value", "labeled"],
    template: `
    <div class="progressbar">
        <div :style="style">
            <template v-if="labeled">
                {{(value / max) * 100}}%
            </template>
        </div>
    </div>
    `,
    computed: {
        style() {
            return "width: " + ((this.value / this.max) * 100) + "%; text-align:right; padding-right:15px;";
        }
    },
});