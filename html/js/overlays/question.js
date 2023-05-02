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
                <button class="margin-5 float-right" @click="$root.goto('','default');$root.$refs.questions.nextQuestion(false);">Begin</button>
            </template>
        </v-frame>
    </v-overlay>
    `,
});