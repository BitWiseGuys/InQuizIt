Vue.component("vHomeScreen",{
    template: `
    <v-screen name="default">
        <h1>{{$root.appName}}</h1>
        <div>
            <hr><br>
            <v-icon icon="list-check" @click="$root.goto('assignments')" :disabled="$root.user == undefined">Assignments</v-icon>
            &nbsp;&nbsp;
            <v-icon icon="list-task" @click="$root.goto('problem sets')" :disabled="$root.user == undefined">Problem&nbsp;Sets</v-icon>
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