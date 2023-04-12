const app = new Vue({
    el: "#MainLayout",
    data: {
        appName: "InquizIt",
        screen: "default",
        overlay: "default",
        users: [],
        user: undefined,
        login_firstname: "",
        login_lastname: "",
        package: { title: "", sets: {} },
        selected_set: [],
        set_options: [],
        databases: {},
    },
    computed: {
        
    },
    methods: {
        login() {
            // Can't login to a non-existing account.
            if(this.login_firstname.length == 0 || this.login_lastname.length == 0) return;
            // Search for existing user.
            let users = this.users;
            for(var i in users) {
                let user = users[i];
                if(user.first == this.login_firstname && user.last == this.login_lastname) {
                    this.user = user;
                    this.overlay = "default";
                    return;
                }
            }
            // Create a new user.
            // TODO: Need to insert into the database.
            var user = { first: this.login_firstname, last: this.login_lastname };
            this.users.push(user);
            this.user = user;
            this.overlay = "default";
        },
        removeUser() {
            // Can't remove a non-existing account.
            if(this.login_firstname.length == 0 || this.login_lastname.length == 0) return;
            // Search for existing user.
            let users = this.users;
            for(var i in users) {
                let user = users[i];
                if(user.first == this.login_firstname && user.last == this.login_lastname) {
                    // Remove this user!
                    users.splice(i, 1);
                    //TODO: Need to remove from the database.
                    return;
                }
            }
        }
    },
    watch: {
        selected_set(newValue) {
            //TODO: Need to aquire set options.
            this.set_options = [
                {
                    "M" : "Multiple Choice", 
                    "T" : "Text entry"
                },
                {
                    "A" : "Test Option",
                }
            ];
        },
    },
    created() {
        // TODO: Needs to get stuff from the database.
        this.users = [
            { first: 'Andrew', last: 'Kerr' },
            { first: 'Grant', last: 'Duchars' },
        ];
    },
});

window.context.root = app;
window.reloadDatabases();