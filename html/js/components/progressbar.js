/**
 * Author: Andrew Kerr
 * Date: 3/23/2023
 * Description: Defines an HTML/VueJS component, v-progressbar which is a progressbar that can be displayed to the screen.
 */

/**
 * HTML Tag: <v-progressbar :max=float :value=float :labeled=boolean><v-progressbar>
 * HTML Attributes:
 *  max[float]       : A floating point number that indicates the maximum possible value that this progressbar should be expecting.
 *  value[float]     : A floating point number that indicates the current value that this progressbar is set to. 
 *  labeled[boolean] : A boolean value that indicates if the progressbar should show a percentage label.
 */
Vue.component("vProgressbar", {
    props: ["max", "value", "labeled", "vertical"],
    template: `
    <div class="progressbar">
        <div :style="'--progress:'+val+'%'">
            <p v-if="labeled">
                {{val}}%
            </p>
        </div>
    </div>
    `,
    computed: {
        /**
         * @returns The current percentage between 0 and 100 rounded to the nearest whole number.
         */
        val() {
            return Math.round(Math.min((this.value / this.max) * 100, 100));
        },
    },
});