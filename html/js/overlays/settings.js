Vue.component("vSettingsOverlay",{
    template: `
    <v-overlay name="settings" type="popup">
        <v-frame :closeable="true" @close="$root.goto('','default');">
            <template #header>
                <h2>Settings</h2>
            </template>
            <template #default>
                
            </template>
            <template #footer>
                
            </template>
        </v-frame>
    </v-overlay>
    `
});

Vue.component("vQuestionSettingsOverlay", {
    template: `
    <v-overlay name="question settings" type="popup">
        <v-frame :closeable="true" @close="$root.goto('','default');">
            <template #header>
                <h2>{{$root.selected_set[0]}} {{$root.selected_set[1]}} Settings</h2>
            </template>
            <template>
                <p v-for="options, i in QOptions">
                    <template v-for="option in options">
                        <input type="radio" :name="'option-'+i" @click="validateOptionSet(i, option)">&nbsp;{{option}}
                    </template>
                </p>
            </template>
            <template #footer>
                <button class="float-right margin-5" :disabled="!isValidOptionSet" @click="$root.selectQuestionSet(QSelected);$root.goto('questions', 'question start');">
                    Start &gt;&gt;
                </button>
            </template>
        </v-frame>
    </v-overlay>
    `,
    data() {
        return {
            QOptions: [],
            QSelected: [],
        }
    },
    computed: {
        isValidOptionSet() {
            if(this.QSelected.length < this.QOptions.length) return false;
            for(var i in this.QSelected) {
                var sel = this.QSelected[i];
                if(sel == undefined) return false;
            }
            return true;
        }
    },
    methods: {
        validateOptionSet(i, opt) {
            while(this.QSelected.length <= i) this.QSelected.push(undefined);
            this.QSelected[i] = opt;
        },
    },
    watch: {
        "$root.selected_set"(newValue) {
            var opts = transpose(newValue[2]);
            for(var i in opts) {
                opts[i] = [...new Set(opts[i])];
            }
            this.QOptions = opts;
        }
    }
});