/**
 * Author: Andrew Kerr
 * Date: 4/04/2023
 * Description: Defines a HTML/VueJS component, v-group, used to group together multiple elements.
 */

Vue.component("vGroup", {
    props: ['direction'],
    template:`
    <div :class="'group group-'+(direction ? direction : 'horizontal')">
        <slot></slot>
    </div>
    `,
});

Vue.component("vGroupCell", {
    template:`
    <div class="group-cell">
        <div>
            <slot></slot>
        </div>
    </div>
    `
});