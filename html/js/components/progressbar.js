Vue.component("vProgressbar", {
    props: ["max", "value", "labeled"],
    template: `
    <div class="progressbar">
        <div :style="style">
            <p v-if="labeled" style="margin:0px;padding:0px;padding-right:5px;">
                {{val}}%
            </p>
        </div>
    </div>
    `,
    computed: {
        val() {
            return Math.round(Math.min((this.value / this.max) * 100, 100));
        },
        style() {
            return "width: " + this.val + "%; text-align:right; padding-right:15px;";
        }
    },
});