/**
 * Author: Andrew Kerr, Grant Duchars, Connor Marshall
 * Date: 04/06/2023
 */

Vue.component("vDatabaseEditor", {
    template: `
    <v-screen name="database editor" class="no-center">
        <h2>Question Editor</h2>
        <div class="flex-fit-content tabs">
            <button :class="'tab '+(tab == 'default' ? 'active' : '')" @click="tab = 'default';">Sets</button>
            <button :class="'tab '+(tab == 'questions' ? 'active' : '')" @click="tab = 'questions';
                                                                                updateQuestionTable();">Questions</button>
            <button :class="'tab '+(tab == 'question' ? 'active' : '')" @click="tab = 'question';">Question Editor</button>
        </div>
        <div class="flex-expand margin-5 margin-top-none tabbed">
            <template v-if="tab == 'default'">
            <div class="scrollable-container">
            <table>
                    <tr>
                        <th colspan="5">
                            <input v-model="filters.SelectionTable" placeholder="Filter">
                            <button @click="fields.SelectionTable.visible = true"><span class="bi bi-plus"></span>&nbsp;Create Entry</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Package</th>
                        <th>Category</th>
                        <th>Set</th>
                        <th>Options</th>
                        <th></th>
                    </tr>
                    <tbody v-show="fields.SelectionTable.visible">
                        <tr>
                            <td><input v-model="fields.SelectionTable.package" placeholder="Package" value="Logicola"></td>
                            <td><input v-model="fields.SelectionTable.category" placeholder="Category" ></td>
                            <td><input v-model="fields.SelectionTable.set" placeholder="Set" ></td>
                            <td><input v-model="fields.SelectionTable.options" placeholder="Options" ></td>
                            <td>
                                <button @click="closeSelectionTable(true)"><span class="bi bi-plus"></span>&nbsp;Add</button>
                                <button @click="closeSelectionTable(false)"><span class="bi bi-x"></span>&nbsp;Cancel</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-for="categories, package in $root.databases">
                        <template v-for="sets, category in categories">
                            <template v-for="options, set in sets">
                                <tr v-for="opt in options" v-show="(package.indexOf(filters.SelectionTable) != -1) || (category.indexOf(filters.SelectionTable) != -1) || (set.indexOf(filters.SelectionTable) != -1) || (opt.indexOf(filters.SelectionTable) != -1)">
                                    <td>{{package}}</td>
                                    <td>{{category}}</td>
                                    <td>{{set}}</td>
                                    <td>{{opt}}</td>
                                    <td>
                                        <button @click="editSet(package, category, set, opt);"><span class="bi bi-pencil"></span>&nbsp;Edit</button>
                                        <button disabled="true"><span class="bi bi-trash"></span>&nbsp;Delete</button>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                </table>
                </div>
            </template>
            <template v-if="tab == 'questions'">
                <h3>{{editor.package}} {{editor.category}} {{editor.set}}-{{editor.options}}</h3>
                <div class = "scrollable-container">
                <table>
                    <tr>
                        <th colspan="5">
                            <input v-model="filters.QuestionTable" placeholder="Filter">
                            <button @click="setupCreateQuestion();"><span class="bi bi-plus"></span>&nbsp;Create Entry</button>
                        </th>
                    </tr>
                    <tr>
                        <th>Type</th>
                        <th>Content (max 100 chars)</th>
                        <th></th>
                    </tr>
                    <tbody v-for="question in editor.questions">
                        <tr>
                            <td>{{question.type}}</td>
                            <td>{{question.content.substring(0,100)}}</td>
                            <td>
                                <button @click="editQuestion(question.type, question.content, question.answers)"><span class="bi bi-pencil"></span>&nbsp;Edit</button>
                                <button @click="deleteThisQuestion(question.type, question.content)"><span class="bi bi-trash"></span>&nbsp;Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </template>
            <template v-if="tab == 'question'">
                <input list="QTypes" placeholder="Question Type" v-model="fields.Question.type">
                <datalist id="QTypes">
                    <option value="MC">Multiple Choice</option>
                    <option value="TB">Textbox Answer</option>
                </datalist>
                <div :style="'width:100%;display:flex;'">
                    <textarea v-model="fields.Question.content" rows="20" cols="100" :style="'resize:none;'" placeholder="Content (use side-panel for special inputs)"></textarea>
                    <div style="margin-left:4px;">
                        <h4 :style="'text-align:center;'">Special Inline-Content Tags</h4>
                        <label>Content Type:</label>
                        <select v-model="fields.Question.special.type">
                            <option value=""></option>
                            <option value="ST">Selectable Text</option>
                            <option value="GEN">Content Generator</option>
                        </select>
                        <div v-if="fields.Question.special.type == 'ST'">
                            <label>Selectable Text:</label>
                            <input ref="selectableText" placeholder="Input Selectable Text">
                            <button @click="catSelectAnswerToContent">Add as Answer</button>
                            <button @click="catSelectOtherToContent">Add as Other</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="displayAnswers" rows="4" cols="100" :style="'width:100%;resize:none;'" placeholder="Answers (seperated by a newline)"></textarea>
                <button @click="commitQuestionToDatabase">Commit to DB</button>
                <button @click="cancelAddQuestion">Cancel</button>
            </template>
        </div>
    </v-screen>
    `,
    data() {
        return {
            tab: "default",
            filters: {
                SelectionTable : "",
                QuestionTable: "",
            },
            Prev_Question: {
                content: "", type: "", answers: "",
                special: {
                    type: "",
                }
            },
            fields: {
                SelectionTable : {
                    visible : false, package : "", category : "", set : "", options: "",
                },
                Question: {
                    content: "", type: "", answers: "",
                    special: {
                        type: "",
                    },
                },
            },
            editor: {
                package : "", category : "", set : "", options: "", questions: [],
            },
        }
    },
    computed:{
      displayAnswers: {
        get: function() {
          return this.fields.Question.answers.join('\n');
        },
        set: function(newValue) {
          this.fields.Question.answers = newValue.split('\n');
        }
      }
    },
    methods: {
        async closeSelectionTable(add) {
            // Are we actually adding the new info?
            if(add) {
                try {
                    await window.addCategory(this.fields.SelectionTable.package, this.fields.SelectionTable.category, this.fields.SelectionTable.set, this.fields.SelectionTable.options);
                    await window.reloadDatabases();
                }
                catch(err) {
                    console.error(err);
                    return;
                }
            }
            this.fields.SelectionTable.visible = false;
            this.fields.SelectionTable.package = "";
            this.fields.SelectionTable.category = "";
            this.fields.SelectionTable.set = "";
            this.fields.SelectionTable.options = "";
        },

        updateQuestionTable(){
          window.loadQuestions().then(() => {
            this.$set(this.editor, "questions", window.context.questions);
          });
        },
        async editSet(package, category, set, options) {
            this.editor = { package, category, set, options };
            window.loadQuestionSet(package, category, set);
            window.addOption(options);
            window.loadQuestions().then(() => {
              this.tab = "questions";
              this.$set(this.editor, "questions", window.context.questions);
            });
            
        },
        editQuestion(type, content, answers) {
            answersArray = JSON.parse(JSON.stringify(answers));
            this.fields.Question = {
                content: content, type: type, answers: answersArray, special: { type: "" }
            };
            this.Prev_Question = {
                content: content, type: type, answers: answersArray, special: { type: "" }
            };
            this.tab = "question";
        },
        setupCreateQuestion() {
            this.fields.Question = {
                content: "", type: "", answers: [],
                special: { type: "", },
            };
            this.fields.Prev_Question = {
                content: "", type: "", answers: [], special: { type: "" }
            };
            this.tab = "question";
        },
        commitQuestionToDatabase() {
            window.deleteQuestion(
                this.Prev_Question.type,
                this.Prev_Question.content,
            ).then(() => {

            let answersArray = JSON.parse(JSON.stringify(this.fields.Question.answers));
            

            console.log(answersArray);



            //answersString = JSON.stringify(this.fields.Question.answers);
            //answersArray = answersString.split('\n');
            


                console.log("window.addQuestion("+this.fields.Question.type + ","+this.fields.Question.content+"," + answersArray + ")");
            
            window.addQuestion(
                this.fields.Question.type,
                this.fields.Question.content,
                answersArray
            );

            this.Prev_Question = {
                content: "", type: "", answers: [],
                special: { type: this.fields.Question.special.type, },
            };
            this.fields.Question = {
                content: "", type: "", answers: [],
                special: { type: this.fields.Question.special.type, },
            };

          });
        },
        catSelectAnswerToContent() {
            this.fields.Question.content += "*[" + this.$refs.selectableText.value + "] ";
        },
        catSelectOtherToContent() {
            this.fields.Question.content += "[" + this.$refs.selectableText.value + "] ";
        },
        cancelAddQuestion() {
            this.Prev_Question = {
                content: "", type: "", answers: [], special: { type: "" }
            };
            this.fields.Question = {
                content: "", type: "", answers: [],
                special: { type: "", },
            };
            this.tab = "questions";
        },
        deleteThisQuestion(type, content) {
            window.deleteQuestion(type, content).then(() => {
              window.loadQuestions().then(() => {
                this.$set(this.editor, "questions", window.context.questions);
            });
          });
        }
    },
})