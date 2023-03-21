/**
 * <div>
                    <span :class="'popup below ' + UsernameClass" :popup-text="PopupText">
                        <input type="text" v-model="username" :class="UsernameClass" v-on:keyup.enter="addUser" @change="UsernameClass='';PopupText='';$forceUpdate();">
                    </span>
                    <button @click="addUser">Add</button>
                </div>
 */

Vue.component("vUserSubscreen", {
    template: `
    <div id="UserSubScreen">
        <h2>Users</h2>
        <div class="existing">
            <h3>Existing Users</h3>
            <div>
                <template v-for="name in $root.users">
                    <p @click="username = name;">{{name}}</p>
                </template>
            </div>
        </div>
        <div class="manageuser">
            <div>
                <h3>Manage User</h3>
                <input type="text" v-model="username" placeholder="Username">
                <v-icon icon="plus" :disabled="exists" @click="addUser"> Add User</v-icon>
                <v-icon icon="trash" :disabled="!exists" @click="deleteUser"> Delete User</v-icon>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            username: "",
        };
    },
    computed: {
        exists() {
            return this.$root.users.indexOf(this.username) != -1;
        }
    },
    methods: {
        addUser() {
            console.log("Add user");
            this.$root.users.push(this.username);
            this.username = "";
        },
        deleteUser() {
            this.$root.users.splice(this.$root.users.indexOf(this.username), 1);
            this.username = "";
        },
    }
});