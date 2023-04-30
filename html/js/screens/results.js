function GenerateSecureScore(score) {
    return "Encoded score goes here!";
}

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
                    <td>{{score.CategoryName}}</td>
                    <td>{{score.SetName}}</td>
                    <td>{{score.SetOptions}}</td>
                    <td>{{score.CurrScore}}</td>
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
            scores: [],
        };
    },
    methods: {
        Submit(score) {
            // Check if we support the clipboard API otherwise we need to go about this the long way.
            if(navigator && navigator.clipboard && navigator.clipboard.writeText)
                navigator.clipboard.writeText(GenerateSecureScore(score));
            else {
                const el = document.createElement('textarea');
                el.value = GenerateSecureScore(score);
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            }
        },
        async onTransitionInto() {
            this.scores = await window.getScores(this.$root.user.first, this.$root.user.last);
        }
    },
});