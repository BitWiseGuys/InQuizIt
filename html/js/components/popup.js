/**
 * Author: Andrew Kerr
 * Date: 3/28/2023
 * Description: Defines two html tags, v-popup and v-popup-screen. 
 *   v-popup is a tooltip popup that is displayed inline with whatever information it is representing.
 *   v-popup-screen is a screen popup that is displayed above all other elements on the page.
 */

/**
 * HTML Tag: <v-popup :text=string :visible=boolean :direction='above|below|right' :type='normal|info|invalid'></v-popup>
 * HTML Attributes:
 *  text[string]      : Dynamic text that is displayed using CSS after the popup has been rendered.
 *  visible[boolean]  : A boolean value that determines if the popup is displayed or not.
 *  direction[string] : A string of which these values are recognized (above, below or right) which will determine the position of the popup.
 *  type[string]      : A string of which these values are recognized (normal, info, invalid) which will determine the border color of the popup.
 * VUE Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  default: Any HTML tags placed within this tag will be placed within the popup prior to the text attribute. 
 */
Vue.component("vPopup", {
    props: ["text", "visible", "direction", "type"],
    template: `
    <span :class="'popup ' + (direction ? direction : 'right') + ' ' + (type ? type : 'normal') + ' ' + ((visible && text && text.length) ? 'show' : '')" :popup-text="text">
        <slot></slot>
    </span>
    `,
});

/**
 * HTML Tag: <v-popup-screen :visible=boolean :type=string :closeable=boolean @close=function></v-popup-screen>
 * HTML Attribute:
 *  visible[boolean]   : A boolean value that determines if this popup is displayed to the screen.
 *  type[string]       : A string of which the following values are recognized (normal, info, invalid) which will determine the border color of the popup.
 *  closeable[boolean] : A boolean value that determines if this popup has a close button by default (if undefined we assume true).
 * VUE Slot: <template v-slot:'slot name'> | <template #'slot name'>
 *  header: Any HTML element placed here will be placed within the popup header.
 *  default: Any HTML element placed here will be placed within the popup body.
 *  footer: Any HTML element placed here will be placed within the popup footer.
 * VUE Emit:
 *  close: IF the popup has a close button (determined by closeable attribute), then this event will be fired when the close button is clicked.
 */
Vue.component("vPopupScreen", {
    props: ["visible", "type", "closeable"],
    template: `
    <div :class="'popup-screen ' + type + ' ' + (visible ? 'show' : '')">
        <div>
            <div class="header">
                <span><slot name="header"></slot></span>
                <v-icon v-if="closeable == undefined || closeable" icon="x-circle-fill" @click="$emit('close');"> Close</v-icon>
            </div>
            <div class="section">
                <span><slot></slot></span>
            </div>
            <div class="footer">
                <span><slot name="footer"></slot></span>
            </div>
        </div>
    </div>
    `,
});