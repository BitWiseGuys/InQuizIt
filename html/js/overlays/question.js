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