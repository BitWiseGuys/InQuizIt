Vue.component("vProblemSetsScreen", {
    template: `
    <v-screen name="problem sets" class="no-center">
        <h2>{{$root.package.title}}</h2>
        <div :class="'table table-grid'" class="flex-expand">
            <div v-for="set, set_name in $root.package.sets" class="children-blocks text-center flex vertical">
                <h3>{{set_name}}</h3>
                <template v-for="opts, name in set">
                    <button @click="$root.selected_set = [set_name, name, opts];" :class="{'active' : ($root.selected_set.length && set_name == $root.selected_set[0] && name == $root.selected_set[1])}">{{name}}</button>
                </template>
            </div>
        </div>
        <br>
        <div class="flex-fit-content padding-15">
            <button class="float-right" :disabled="$root.selected_set.length == 0" @click="$root.goto('','question settings');">
                <span class="bi bi-gear-fill"></span> Start
            </button>
        </div>
    </v-screen>
    `,
});
