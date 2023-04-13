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
        questionContext: {},
        questionContent: "",
        questionProgress: 0,
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
        },
        selectPackage(name) {
            this.package.title = name;
            this.refreshProblemSets();
        },
        refreshProblemSets() {
            if(this.package.title in this.databases)
                this.package.sets = this.databases[this.package.title];
            else this.package.sets = {};
        },
        selectQuestionSet() {
            let self = this;
            window.loadQuestionSet(this.package.title, this.selected_set[0], this.selected_set[1]);
            window.addOption(this.selected_set[2][0]);
            console.log(window.loadQuestions().then(()=>{
                self.questionProgress = -1;
                self.nextQuestion(-1);
                self.$forceUpdate();
            }));
        },
        nextQuestion(lvl) {
            var q = window.selectNextQuestion();
            if(!q) return;
            // Temporary override for demo
            if(lvl == 4)
                this.questionContent = "This is a test question that take advantage of the [selectable] text feature along with the ability to generate content {gen-person:1(firstname)}";
            else
                this.questionContent = q.content;
            this.questionContext = {};
            this.questionProgress++;
        }
    },
    watch: {
        databases(newValue) {
            this.refreshProblemSets();
        },
    },
    created() {
        // TODO: Needs to get stuff from the database.
        this.users = [
            { first: 'Andrew', last: 'Kerr' },
            { first: 'Grant', last: 'Duchars' },
        ];
        this.selectPackage("Logicola");
    },
});

window.context.root = app;
window.reloadDatabases();