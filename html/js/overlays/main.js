/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the main overlay that the user will be first shown upon program startup.
 */

/**
 * HTML Tag: <v-main-overlay></v-main-overlay>
 */
Vue.component("vMainOverlay", {
    template: `
    <v-overlay name="default" class="padding-15">
        <v-group :direction="'horizontal'">
            <v-group-cell>
                <v-icons>
                    <v-icon icon="house-fill" @click="$root.goto('default');" title="Return Home" :disabled="$root.screen == 'default'"></v-icon>
                </v-icons>
            </v-group-cell>
            <v-group-cell v-show="$root.screen == 'questions'">
                <v-progressbar :max="$root.$refs.questions.max_score" :value="$root.$refs.questions.progress" :labeled="true" :style="'width:400px;'"></v-progressbar>
            </v-group-cell>
            <v-group-cell>
                <v-icon icon="person" @click="$root.goto('','login');" :disabled="$root.screen != 'default'" title="Login/Logout">
                    {{$root.user ? ($root.user.first + '&nbsp;' + $root.user.last) : 'Login'}}
                </v-icon>
            </v-group-cell>
        </v-group>
    </v-overlay>
    `,
});