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
            <button :class="'tab '+(tab == 'answers' ? 'active' : '')" @click="tab = 'answers';" :disabled="question == undefined">Answers</button>
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
                            {{set.SetName}}-{{set.SetOptions}}
                        </button>
                    </template>
                </template>
                <h3>Create Set</h3>
                <input ref="nQuestionCategory" placeholder="Question Category" list="QCategory">
                <datalist id="QCategory">
                    <template v-for="_, category in database.sets">
                        <option :value="category"></option>
                    </template>
                </datalist>
                <input ref="nQuestionSetName" placeholder="Question Set Name">
                <input ref="nQuestionOptions" placeholder="Question Options">
                <button @click="addSet">Create Set</button>
            </div>
            <br>
            <div v-show="tab == 'sets'" v-if="database_set != undefined" class="border-top-accent">
                <h3>{{database_set.category}} {{database_set.set.SetName}}-{{database_set.set.SetOptions}}</h3>
                <table>
                    <tr>
                        <th>Question Type</th>
                        <th>Question Content</th>
                        <th>&nbsp;</th>
                    </tr>
                    <tr v-for="question in database_set.questions">
                        <td>{{question.QuestionType}}</td>
                        <td class="text-nowrap">{{question.QuestionContent.substring(0, 100)}}</td>
                        <td>
                            <a class="hoverable bi bi-pencil" @click="editQuestion(question)">&nbsp;Edit</a>
                            <a class="hoverable bi bi-trash">&nbsp;Delete</a>
                        </td>
                    </tr>
                </table>
                <h3>Create Question</h3>
                <input ref="nQuestionType" list="QTypes" placeholder="Question Type">
                <datalist id="QTypes">
                    <option value="MC">Multiple Choice</option>
                    <option value="TB">Textbox</option>
                </datalist>
                <button @click="addQuestion">Create Question</button>
            </div>
            <div v-show="tab == 'question'" v-if="question">
                <h3 class="inline">
                    Question Content
                </h3>&nbsp;
                <v-icons mode="select" @change="(val)=>{ display_format = val; }" class="inline">
                    <v-icon icon="card-text" value="formatted" title="Render Question"></v-icon>
                    <v-icon icon="body-text" value="text" title="Edit Question"></v-icon>
                </v-icons>
                <div v-if="display_format == 'text'" class="margin-10">
                    <textarea v-model="question.QuestionContent" rows="20" cols="100" :style="'width:100%;resize:none;'"></textarea>
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
                                <span v-if="insert_format == 'selectable-text'"><input type="checkbox" ref="answer">Is Answer?</span>
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
                <div v-if="display_format == 'formatted'" class="margin-10">
                    <v-metatag :context="display_context" :text="question.QuestionContent"></v-metatag>
                    <v-metatag :context="display_context" :text="question.Answers"></v-metatag>
                </div>
            </div>
            <div v-show="tab == 'answers'" v-if="question">
                <h3>Answers</h3>
                <template v-for="answer in question.answers">
                    <textarea v-model="answer.Answer" rows="1" cols="100" :style="'width:100%;resize:none;'"></textarea>
                </template>
            </div>
            <button v-show="tab == 'question' || tab == 'answers'" @click="saveQuestion">Save Question</button>
        </div>
    </v-screen>
    `,
    data() {
        return {
            tab: 'default',
            databases: [],
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
            display_format: undefined,
            display_context: {},
        }
    },
    methods: {
        loadDB(db) {
            var promise = window.db.getAllCategories();
            promise.then((res)=>{
                console.log(res);
                this.database = { title : db, sets : {
                    "A" : [
                        {
                            SetName: "A",
                            SetOptions: "A",
                        }
                    ],
                }};
            });
        },
        loadSet(category, set) {
            let self = this;
            var promise = window.db.getAllQuestions(category, set.SetName, set.SetOptions);
            promise.then((res)=>{
                self.database_set = {
                    category: category,
                    set: set,
                    questions: res
                };
            });
        },
        editQuestion(question) {
            let self = this;
            var promise = window.db.getAllAnswers(question.SetCategory, question.SetName, question.SetOptions, question.QuestionContent, question.QuestionType);
            promise.then((res)=>{
                self.question = question;
                self.question.answers = res;
            });
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
                this.question.QuestionContent += this.sanitize(this.$refs["text"].value);
            else if(this.insert_format == "selectable-text")
                this.question.QuestionContent += "["+this.sanitize(this.$refs["text"].value)+"]";
            else if(this.insert_format == "generator") {
                var result = this.$refs.gen.value;
                if(this.generators[this.$refs.gen.value].cacheable)
                    result += ":" + this.sanitize(this.$refs.id.value);
                if(this.generators[this.$refs.gen.value].attributes && this.$refs.attr.value.length)
                    result += "(" + this.$refs.attr.value + ")";
                this.question.QuestionContent += "{"+result+"}";
            }
        },
        saveQuestion() {

        },
        addQuestion() {

        },
        addSet() {
            let self = this;
            window.db.newQuestionSet(this.$refs.nQuestionCategory.value, this.$refs.nQuestionSetName.value, this.$refs.nQuestionOptions.value)
            .then(()=>{
                self.loadDB();
            });
        }
    },
    created() {
        let self = this;
        var promise = window.db.getAllQuestionSets();
        promise.then((_dbs) => {
            var dbs = {};
            for(var i in _dbs)
                dbs[_dbs[i].PackageName] = true;
            self.databases = Object.keys(dbs);
        });
    }
})