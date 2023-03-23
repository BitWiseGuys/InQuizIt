// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A simple Vue wrapper class for our bootstrap icons.

window["icon"] = {};
window["icon"]["shapes"] = ["square", "circle"];

Vue.component("vIcon", {
    props: ["icon", "options", "disabled", "pressed"],
    template: `
        <a  :class="'bi bi-' + icon + ' ' + shape + ' ' + (disabled ? 'disabled' : '') + (options && options['class'] ? ' ' + options['class'] : '') + ((options && options['sticky'] && pressed) ? ' icon-pressed' : '')" @click="!disabled && $emit('click',$event);">
            <slot></slot>
        </a>
    `,
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