Vue.component("vLoginOverlay", {
    template: `
    <v-overlay name="login" type="popup">
        <v-frame>
            <template #header>
                <h2>Login</h2>
            </template>
            <template #default>
                <h3>Existing Users:</h3>
                <div class="users">
                    <template v-for="user in $root.users">
                        <span @click="firstname = user.FirstName; lastname = user.LastName;">
                            {{user.FirstName}}&nbsp;{{user.LastName}}
                        </span>
                    </template>
                </div>
            </template>
            <template #footer>
                <p>
                    Firstname: <input type="text" v-model="firstname">
                    Lastname: <input type="text" v-model="lastname">
                    <v-icon icon="person" @click="login">Login</v-icon>
                    <v-icon icon="trash" @click="removeUser"></v-icon>
                </p>
            </template>
        </v-frame>
    </v-overlay>
    `,
    data() {
        return {
            firstname: "",
            lastname: "",
        };
    },
    methods: {
        login() {
            // Can't login to a non-existing account.
            if(this.firstname.length == 0 || this.lastname.length == 0) return;
            // Search for existing user.
            let users = this.$root.users;
            for(var i in users) {
                let user = users[i];
                if(user.FirstName == this.firstname && user.LastName == this.lastname) {
                    this.$root.user = { first: user.FirstName, last: user.LastName };
                    this.$root.goto("","default");
                    this.$root.$forceUpdate();
                    return;
                }
            }
            // Create a new user.
            database.addUser(this.firstname, this.lastname).then(()=>{
                this.$root.user = { first: this.firstname, last: this.lastname };
                this.$root.goto("","default");
                this.$root.$forceUpdate();
            });
        },
        removeUser() {
            // Can't remove a non-existing account.
            if(this.firstname.length == 0 || this.lastname.length == 0) return;
            database.removeUser(this.firstname, this.lastname).then(()=>{
                this.$root.$forceUpdate();
            });
        },
    }
});