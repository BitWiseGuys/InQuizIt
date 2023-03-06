Vue.component("vIconGroup", {
    props: ["icons"],
    template: `
    <div class="icon-group">
        <template v-for="icon in icons">
            <v-icon ref="icon" :disabled="icon.disabled" :icon="icon.icon" :options="icon.options" :title="icon.title" @click="selected = icon; $emit('change', icon); $emit('click', {$event, icon});"></v-icon>
        </template>
    </div>
    `,
    data() {
        return {
            selected: undefined,
        }
    }
})