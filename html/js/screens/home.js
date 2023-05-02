/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the main screen that the user will be first shown upon program startup.
 */

/**
 * HTML Tag: <v-home-screen></v-home-screen>
 */
Vue.component("vHomeScreen",{
    template: `
    <v-screen name="default">
        <h1>{{$root.appName}}</h1>
        <div>
            <hr><br>
            <v-icon icon="database-fill-gear" @click="$root.goto('database editor','')" :disabled="$root.user == undefined">&nbsp;Question&nbsp;Editor</v-icon>
            &nbsp;&nbsp;
            <v-icon icon="list-check" @click="$root.goto('results','')" :disabled="$root.user == undefined">&nbsp;Scores</v-icon>
            &nbsp;&nbsp;
            <v-icon icon="list-task" @click="$root.goto('problem sets')" :disabled="$root.user == undefined">&nbsp;Problem&nbsp;Sets</v-icon>
            <p v-if="$root.user == undefined" class="smaller-icons">
                Please 
                <a @click="$root.goto('', 'login');$event.preventDefault();" href="#">
                    Login
                </a> 
                to Continue.
            </p>
            <p v-if="$root.user != undefined">
                Welcome back: {{$root.user.first}} {{$root.user.last}}!
            </p>
        </div>
    </v-screen>
    `,
});