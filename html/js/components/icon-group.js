Vue.component("vIconGroup", {
    props: ["icons"],
    template: `
    <div class="icon-group">
        <template v-for="icon in icons">
            <v-icon :disabled="icon.disabled" :icon="icon.icon" :options="{shape: 'square'}" :title="icon.title" @click="$emit('click', {$event, icon})"></v-icon>
        </template>
    </div>
    `,
    data() {
        return {
            selected : "",
        };
    }
})