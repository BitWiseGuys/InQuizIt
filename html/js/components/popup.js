Vue.component("vPopup", {
    props: ["text", "visible", "direction", "type"],
    template: `
    <span :class="'popup ' + (direction ? direction : 'right') + ' ' + (type ? type : 'normal') + ' ' + ((visible && text && text.length) ? 'show' : '')" :popup-text="text">
        <slot></slot>
    </span>
    `,
});

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