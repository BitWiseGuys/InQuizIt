/**
 * Author: Andrew Kerr
 * Date: 4/4/2023
 * Description: Defines the settings overlay for both general settings and question set specific settings.
 */

/** UNUSED
 * HTML Tag: <v-settings-overlay></v-settings-overlay>
 */


Vue.component("vSettingsOverlay",{
    template: `
    <v-overlay name="settings" type="popup">
        <v-frame :closeable="true" @close="$root.goto('','default');">
            <template #header>
                <h2>Settings</h2>
            </template>
            <template #default>
                <div class="margin-5">
                    <p>Click the button below to add content to the application.</p>
                    <button @click="addPackage">Add Package</button>
                    <p>Click the button below to replace ALL existing content in the application.</p>
                    <button @click="replacePackage">Replace Package</button>
                    <p>Click the button below to export your current package to the desktop.</p>
                    <button @click="exportPackage">Export Package</button>
                </div>
            </template>
            <template #footer>
                
            </template>
        </v-frame>
    </v-overlay>
    `,
    methods: {
        async addPackage() {
            await window.db.databaseAction(false);
            window.location.reload();
            
        },
        async replacePackage() {
            await window.db.databaseAction(true);
            window.location.reload();
        },
        async exportPackage() {
          await window.db.exportPackage();
        }
    }
});

/**
 * HTML Tag: <v-question-settings-overlay></v-question-settings-overlay>
 */
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
            // The options that are available to be selected from.
            QOptions: [],
            // The actually selected options that the user has choosen.
            QSelected: [],
            isValidOptionSet: false,
        }
    },
    computed: {
        /**
         * Checks to see if we have a valid option set to work with.
         * @returns True if we have a valid set of options, otherwise false.
         */
        // isValidOptionSet() {
        //     if(this.QSelected.length < this.QOptions.length) return false;
        //     console.log("Checking further...");
        //     for(var i = 0; i < this.QOptions.length; i++) {
        //         var sel = this.QSelected[i];
        //         if(sel == undefined) return false;
        //     }
        //     return true;
        // }
    },
    methods: {
        /**
         * Sets the option within the set of options at the given index to the given option.
         * @param {Number} i The index within the array of options that we are setting.
         * @param {String} opt The option that has been chosen. 
         */
        validateOptionSet(i, opt) {
            while(this.QSelected.length < i) this.QSelected.push(undefined);
            this.QSelected[i] = opt;
            if(this.QSelected.length < this.QOptions.length) { this.isValidOptionSet = false; return; }
             for(var i = 0; i < this.QOptions.length; i++) {
                 var sel = this.QSelected[i];
                 if(sel == undefined) { this.isValidOptionSet = false; return; }
             }
             this.isValidOptionSet = true;
        },
    },
    watch: {
        /**
         * Watches the value at "$root.selected_set" and will be triggered upon update.
         * @param {Array} newValue The new value that "$root.selected_set" has been changed to.
         */
        "$root.selected_set"(newValue) {
            var opts = transpose(newValue[2]);
            for(var i in opts) {
                opts[i] = [...new Set(opts[i])];
            }
            this.QOptions = opts;
        }
    }
});