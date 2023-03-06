// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A simple Vue wrapper class for our bootstrap icons.

window["icon"] = {};
window["icon"]["shapes"] = ["square", "circle"];

Vue.component("vIcon", {
    props: ["icon", "options", "disabled"],
    template: `<a  :class="'bi bi-' + icon + ' ' + shape + ' ' + (disabled ? 'disabled' : '') + (options && options['class'] ? ' ' + options['class'] : '')" @click="$emit('click',$event);"></a>`,
    data() {
        return {
            shape : "icon-circle",
        }
    },
    created() {
        if(this.options && typeof(this.options) == "object") {
            if(this.options["shape"] && window["icon"]["shapes"].includes(this.options["shape"]))
                this.shape = "icon-" + this.options["shape"];
        }
    }
});