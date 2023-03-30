const app = new Vue({
    el: "#MainLayout",
    data: {
        appName: "InquizIt-Database",
        users: [],
        user: undefined,
        database: {
            available: [],
            selected: undefined,
            scratch: "",
        }
    },
    computed: {
        
    },
    methods: {
        changeDatabase() {
            this.database.selected = undefined;
        },
        selectDatabase() {
            if(this.database.available.indexOf(this.database.scratch) != -1) {
                this.database.selected = this.database.scratch;
            }
        },
    },
    watch: {

    },
    created() {
        this.database.available = ["LogiCola"];
    },
});