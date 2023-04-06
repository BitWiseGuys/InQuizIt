/**
 * Author: Andrew Kerr
 * Date: 04/06/2023
 */

Vue.component("vDatabaseEditor", {
    template: `
    <v-screen name="database editor" class="no-center">
        <h2>Database Editor</h2>
        <div class="flex-fit-content tabs">
            <button :class="'tab '+(tab == 'default' ? 'active' : '')" @click="tab = 'default';">Databases</button>
            <button :class="'tab '+(tab == 'sets' ? 'active' : '')" @click="tab = 'sets';" :disabled="database == undefined || database.sets == undefined">Sets</button>
            <button :class="'tab '+(tab == 'question' ? 'active' : '')" @click="tab = 'question';" :disabled="question == undefined">Question</button>
        </div>
        <div class="flex-expand margin-5 margin-top-none tabbed">
            <div v-show="tab == 'default'">
                <h3>Choose Database</h3>
                <button v-for="db in databases" @click="loadDB(db)" :class="{'active' : (database && database.title == db)}">
                    {{db}}
                </button>
            </div>
            <div v-show="tab == 'sets'" v-if="database != undefined">
                <template v-for="sets, category in database.sets">
                    <h4>{{category}}</h4>
                    <template v-for="set in sets">
                        <button @click="loadSet(category, set)" :class="{'active' : (database_set && database_set.category == category && database_set.set == set)}">
                            {{set}}
                        </button>
                    </template>
                </template>
            </div>
            <br>
            <div v-show="tab == 'sets'" v-if="database_set != undefined" class="border-top-accent">
                <h3>{{database_set.category}} {{database_set.set}}</h3>
                <table>
                    <tr>
                        <th>Question Type</th>
                        <th>Question Content</th>
                        <th>&nbsp;</th>
                    </tr>
                    <tr v-for="question in database_set.questions">
                        <td></td>
                        <td class="text-nowrap">{{question.content}}</td>
                        <td>
                            <a class="hoverable bi bi-pencil" @click="editQuestion(question)">&nbsp;Edit</a>
                            <a class="hoverable bi bi-trash">&nbsp;Delete</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div v-show="tab == 'question'" v-if="question">
                <h3>Question Content</h3>
                <div>
                    <textarea v-model="question.content" rows="20" cols="100" :style="'width:100%;resize:none;'"></textarea>
                    <div :style="'width:100%;border: 1px var(--theme-color-accent-normal) solid;border-radius:5px;'">
                        <h3>Content Formatter</h3>
                        <div>
                            <select v-model="insert_format">
                                <option value="default">Regular Text</option>
                                <option value="selectable-text">Selectable Text</option>
                                <option value="generator">Content Generator</option>
                            </select>
                            <template v-if="insert_format == 'selectable-text' || insert_format == 'default'">
                                <input type="text" ref="text" placeholder="Text here">
                            </template>
                            <template v-if="insert_format == 'generator'">
                                <input type="text" ref="gen" list="generators" placeholder="Generator Name" v-model="generator">
                                <datalist id="generators">
                                    <option v-for="_, gen in generators" :value="gen"></option>
                                </datalist>
                                <input type="text" ref="id" placeholder="Cache Identifier" v-if="$refs.gen && generators[$refs.gen.value].cacheable">
                                <select v-if="$refs.gen && generators[$refs.gen.value].attributes" ref="attr" placeholder="Attribute">
                                    <option value="">Stringify</option>
                                    <option v-for="attr in generators[$refs.gen.value].attributes" :value="attr">{{attr}}</option>
                                </select>
                            </template>
                            <button @click="insertFormatted">Add</button>
                        </div>
                        <br>
                    </div>
                </div>
            </div>
        </div>
    </v-screen>
    `,
    data() {
        return {
            tab: 'default',
            databases: ["LogiCola", "PhiloCola"],
            database: undefined,
            database_set: undefined,
            question: undefined,
            insert_format: "default",
            generator: undefined,
            generators: {
                "person" : { attributes: [ "first-name", "last-name" ], cacheable: true },
                "noun" : { attributes: false, cacheable: true },
                "adjective" : { attributes: false, cacheable: true },
            },
        }
    },
    methods: {
        loadDB(db) {
            //TODO: Need to load database and setup for other tabs.
            this.database = { title : db, sets : {
                "Syllogistic" : [ "Translations", "Arguments" ],
            }};
        },
        loadSet(category, set) {
            this.database_set = {
                category: category,
                set: set,
                questions: [
                    {
                        content: "This is a test {gen-person:1(first-name)}",
                    },
                ]
            }
        },
        editQuestion(question) {
            this.question = question;
        },
        sanitize(str) {
            var result = str;
            result = result.replaceAll("[", "\\[");
            result = result.replaceAll("]", "\\]");
            result = result.replaceAll("{", "\\{");
            result = result.replaceAll("}", "\\}");
            return result;
        },
        insertFormatted() {
            if(this.insert_format == "default")
                this.question.content += this.sanitize(this.$refs["text"].value);
            else if(this.insert_format == "selectable-text")
                this.question.content += "["+this.sanitize(this.$refs["text"].value)+"]";
            else if(this.insert_format == "generator") {
                var result = this.$refs.gen.value;
                if(this.generators[this.$refs.gen.value].cacheable)
                    result += ":" + this.sanitize(this.$refs.id.value);
                if(this.generators[this.$refs.gen.value].attributes && this.$refs.attr.value.length)
                    result += "(" + this.$refs.attr.value + ")";
                this.question.content += "{"+result+"}";
            }
        }
    }
})