Vue.component("vIconGroup", {
    props: ["icons", "disabled"],
    template: `
    <div class="icon-group">
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