/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the prompt that is shown to the user prior to the start of the question set.
 */

/**
 * HTML Tag: <v-question-start-overlay></v-question-start-overlay>
 */
Vue.component("vQuestionStartOverlay", {
    template: `
    <v-overlay name="question start" type="popup">
        <v-frame>
            <template #header>
                <h2>{{$root.selected_set[0]}} {{$root.selected_set[1]}}</h2>
            </template>
            <template #default>
                <p>{{$root.QDescription}}</p>
            </template>
            <template #footer>
                <div class="flex horizontal margin-5">
                    <v-progressbar :max="$root.$refs.questions.max_score" :value="$root.$refs.questions.progress" :labeled="true" class="flex-stretch"></v-progressbar>
                    <button class="flex-no-stretch" @click="$root.goto('','default');$root.$refs.questions.progress=0;$root.$refs.questions.nextQuestion(false);" v-show="$root.$refs.questions.progress">Restart</button>
                    <button class="flex-no-stretch" @click="$root.goto('','default');$root.$refs.questions.nextQuestion(false);">{{$root.$refs.questions.progress ? 'Continue' : 'Begin'}}</button>
                </div>
            </template>
        </v-frame>
    </v-overlay>
    `,
});