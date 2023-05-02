// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A simple Vue wrapper class for our bootstrap icons.

/**
 * HTML Tag: <v-icon :icon=string :disabled=boolean :pressed=boolean @click=function></v-icon>
 * HTML Attributed:
 *  icon[string]      : A bootstrap icon value used to determine what icon will be displayed.
 *  disabled[boolean] : A boolean value used to determine if the icon can be clicked or if it should ignore the click.
 *  pressed[boolean]  : A boolean value that is used to determine if the button should appear to be in the pressed state.
 * Vue Emit:
 *  click: When the attribute disabled equates to false this event will fire whenever the icon is clicked, otherwise no event will fire.
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Appends the given elements after the displayed icon.
 */
Vue.component("vIcon", {
    props: ["icon", "disabled", "clickable", "pressed", "value"],
    template: `
        <a  :class="'icon bi bi-' + icon + ' icon-square ' + (disabled ? 'disabled' : '') + (isSelected ? ' icon-pressed' : '') + (canClick ? ' clickable' : '')" @click="click($event);">
            <slot></slot>
        </a>
    `,
    computed: {
        isSelected() {
            if(this.$parent.mode == "select")
                return this.$parent.selected == this.value;
            if(this.$parent.mode == "toggle")
                return this.toggled;
            return this.pressed;
        },
        canClick() {
            return !this.disabled && (this.clickable != undefined ? this.clickable : true);
        }
    },
    methods: {
        click(e) {
            // Check if we can even be clicked.
            if(!this.canClick) return;
            // Handle select and toggle modes.
            if(this.$parent.mode == "select") {
                this.$parent.selected = this.value;
                this.$parent.$emit("change", this.value);
            }
            if(this.$parent.mode == "toggle")
                this.toggled = !this.toggled;
            // Call an outside function to inform them of a click.
            this.$emit('click',e);
        }
    },
    data() {
        return {
            // Keeps track of if this icon is toggled or not (only used if the parent mode is 'toggle').
            toggled: false,
        }
    }
});

/**
 * HTML Tag: <v-icons mode=string></v-icons>
 * HTML Attributes:
 *  mode[string] : An optional string of either "select" or "toggle", where:
 *                    "select": allows one inter-icon to be selected and,
 *                    "toggle": allows each inter-icon to be toggleable.
 * Vue Slot: 
 *  default: A place to insert all of the inter-icons.
 * Vue Emit:
 *  change: When the mode is "select" this event is emitted when a inter-icon is selected.
 */
Vue.component("vIcons", {
    props: ["mode"],
    template: `
    <div class="icons">
        <slot></slot>
    </div>
    `,
    data() {
        return {
            selected: undefined,
        }
    }
});