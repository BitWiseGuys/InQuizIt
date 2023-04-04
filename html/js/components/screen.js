/**
 * Author: Andrew Kerr
 * Date: 4/04/2023
 */

Vue.component("vScreen", {
    props: ["name"],
    template: `
    <div v-show="shouldShow" class="screen">
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
    props: ["name"],
    template: `
    <div v-show="shouldShow" class="overlay">
        <slot></slot>
    </div>
    `,
    computed: {
        shouldShow() {
            return this.$root.overlay == this.name;
        },
    },
})