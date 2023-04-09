/**
 * Author: Andrew Kerr
 * Data: 3/23/2023
 * Description: Defines an HTML/VueJS element, v-icon-group used to display multiple icon's within a group.
 */

/** DEPRECATED
 * HTML Tag: <v-icon-group :icons=array :disabled=boolean></v-icon-group>
 * HTML Attributes:
 *  icons[array]      : An array of objects of which each object defines an icon, its options and an optional title.
 *  disabled[boolean] : A boolean value that indicates if the icon group is disabled or not.
 * Vue Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  prepend: Prepends the given elements to the icon group.
 */
Vue.component("vIconGroup", {
    props: ["icons", "disabled"],
    template: `
    <div class="icon-group">
        <slot name="prepend"></slot>
        <template v-for="icon in icons">
            <v-icon ref="icon" :disabled="icon.disabled || disabled" :icon="icon.icon" :options="icon.options" :title="icon.title" :pressed="selected == icon" @click="internalSelect($event, icon)"></v-icon>
        </template>
    </div>
    `,
    data() {
        return {
            // The currently selected icon in our array of icons.
            selected: undefined,
        }
    },
    methods: {
        // Makes a selection using a given value, this is the preferred and correct way to select
        //  an icon externally from this component.
        setSelected(value) {
            let self = this;
            if(typeof this.icons == "object") {
                this.icons.forEach((icon) => {
                    if(icon && icon["value"] != undefined && icon["value"] == value)
                        self.selected = icon;
                });
            }
        },
        // Makes an internal selection (called by the individual icons whenever they are clicked).
        internalSelect(event, icon) {
            // We can only make a change if the icon itself is different then
            //  what we currently have selected.
            if(this.selected != icon) {
                this.selected = icon;
                this.$emit('change', icon);
            }
            // No matter what we will always call the click callback.
            this.$emit('click', {event, icon});
        }
    },
    watch: {
        icons(newValue, oldValue) {
            // Check if we got a valid icon array.
            if(newValue && typeof(newValue) == "object") {
                var found = false;
                // Check if our current selection is within this array.
                newValue.forEach((icon)=>{
                    // IF its already found then just bail the search.
                    if(found) return;
                    // Did we find a match?
                    if(selection == icon)
                        found = true;
                });
                // If we didn't find our selection then we deselect.
                if(!found) this.selected = undefined;
            }
            // Otherwise just deselect and let this error out.
            else this.selected = undefined;
        }
    }
})