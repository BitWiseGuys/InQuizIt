/**
 * Author: Andrew Kerr
 * Date: 4/04/2023
 * Description: Defines a HTML/VueJS component, v-group, used to group together multiple elements.
 */

/**
 * HTML Tag: <v-group :direction=string>...</v-group>
 * Attributes:
 *  direction[string]: A string that indicates the direction of the group, either "vertical" or "horizontal" (the latter is default).
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Places the childrent elements into the group.
 */
Vue.component("vGroup", {
    props: ['direction'],
    template:`
    <div :class="'group group-'+(direction ? direction : 'horizontal')">
        <slot></slot>
    </div>
    `,
});

/**
 * HTML Tag: <v-group-cell>...</v-group-cell>
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Places the childrent elements into the group.
 */
Vue.component("vGroupCell", {
    template:`
    <div class="group-cell">
        <div>
            <slot></slot>
        </div>
    </div>
    `
});