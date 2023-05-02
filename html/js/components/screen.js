/**
 * Author: Andrew Kerr
 * Date: 4/04/2023
 */

/**
 * HTML Tag: <v-screen :name=string></v-screen>
 * Attributes:
 *  name[string]: A string that defines the name of the screen, no two screens should have the same name as this is used for navigation purposes.
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Places the childrent elements into the screen.
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

/**
 * HTML Tag: <v-overlay :name=string></v-overlay>
 * Attributes:
 *  name[string]: A string that defines the name of the overlay, no two screens should have the same name as this is used for navigation purposes.
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Places the childrent elements into the overlay.
 */
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

/**
 * HTML Tag: <v-frame :closeable=boolean></v-frame>
 * Attributes:
 *  closeable[boolean]: A boolean value that indicates if there should be a close button on the frame's header.
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Places the children elements into the body of the frame.
 *  header : Places the children elements into the header of the body.
 *  footer : Places the children elements into the footer of the body.
 */
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