/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the main overlay that the user will be first shown upon program startup.
 */

/**
 * Generates an encrypted version of the users score.
 * @param {Object} score An object containing the data that needs to be encoded.
 * @returns A string of three values encoding the encrypted data.
 */
async function GenerateSecureScore(score) {
    return await window.db.encryptScore(String(score.CurrentScore));
}

/**
 * HTML Tag: <v-results-screen></v-results-screen>
 */
Vue.component("vResultsScreen", {
    template: `
    <v-screen name="results" class="no-center">
        <h2>Scores</h2>
        <div class="flex-expand margin-5">
            <table>
                <tr>
                    <th>Package</th>
                    <th>Category</th>
                    <th>Set</th>
                    <th>Options</th>
                    <th>Score</th>
                    <th></th>
                </tr>
                <tr v-for="score in scores">
                    <td>{{score.PackageName}}</td>
                    <td>{{score.SetCategory}}</td>
                    <td>{{score.SetName}}</td>
                    <td>{{score.SetOptions}}</td>
                    <td>{{score.CurrentScore}}</td>
                    <td>
                        <button @click="Submit(score)">Submit</button>
                    </td>
                </tr>
                <tr v-if="!scores || !scores.length">
                    <td colspan="6" class="text-center">
                        No scores to display, complete a module to have it show up here.
                    </td>
                </tr>
            </table>
        </div>
    </v-screen>
    `,
    data() {
        return {
            // An array of scores that the user has completed.
            scores: [],
        };
    },
    methods: {
        /**
         * Submits the users score, in this case does so by copying it to the clipboard.
         * @param {Object} score The individual score object (held within scores array) that we are submitting.
         */
        async Submit(score) {
            // Check if we support the clipboard API otherwise we need to go about this the long way.
            if(navigator && navigator.clipboard && navigator.clipboard.writeText)
                navigator.clipboard.writeText(await GenerateSecureScore(score));
            else {
                const el = document.createElement('textarea');
                el.value = await GenerateSecureScore(score);
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
        },
        /**
         * Called by the root whenever we are transitioning from a different screen into this one.
         */
        async onTransitionInto() {
            this.scores = await window.getScores(this.$root.user.first, this.$root.user.last);
        }
    },
});