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
                        <span @click="firstname = user.first; lastname = user.last;">
                            {{user.first}}&nbsp;{{user.last}}
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
                if(user.first == this.firstname && user.last == this.lastname) {
                    this.$root.user = user;
                    this.$root.goto("","default");
                    return;
                }
            }
            // Create a new user.
            // TODO: Need to insert into the database.
            var user = { first: this.login_firstname, last: this.login_lastname };
            this.$root.users.push(user);
            this.$root.user = user;
            this.$root.goto("","default");
        },
        removeUser() {
            // Can't remove a non-existing account.
            if(this.firstname.length == 0 || this.lastname.length == 0) return;
            // Search for existing user.
            let users = this.$root.users;
            for(var i in users) {
                let user = users[i];
                if(user.first == this.firstname && user.last == this.lastname) {
                    // Remove this user!
                    users.splice(i, 1);
                    //TODO: Need to remove from the database.
                    return;
                }
            }
        },
    }
});