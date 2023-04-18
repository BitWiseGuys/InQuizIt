/**
 * Author: Andrew Kerr
 * Date: 4/04/2023
 */

Vue.component("vScreen", {
    props: ["name"],
    template: `
    <div v-if="shouldShow" class="screen">
        <slot></slot>
    </div>
    `,
    computed: {
        shouldShow() {
            return this.$root.screen == this.name;
        },
    },
});

Vue.component("vOverlay", {
    props: ["name", "type"],
    template: `
    <div v-if="shouldShow" :class="'overlay overlay-' + (type ? type : 'normal')">
        <slot></slot>
    </div>
    `,
    computed: {
        shouldShow() {
            return this.$root.overlay == this.name;
        },
    },
})

Vue.component("vFrame", {
    props: ["closeable"],
    template: `
    <div class="frame">
        <div class="header">
            <span><slot name="header"></slot></span>
            <v-icon v-if="closeable != undefined && closeable" icon="x-circle-fill" @click="$emit('close');"> Close</v-icon>
        </div>
        <div class="section">
            <slot></slot>
        </div>
        <div class="footer">
            <slot name="footer"></slot>
        </div>
    </div>
    `
});