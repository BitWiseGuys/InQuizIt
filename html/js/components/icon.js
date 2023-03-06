// Author: Andrew Kerr
// Date: 03/05/2023
// Description: A simple Vue wrapper class for our bootstrap icons.

Vue.component("vIcon", {
    props: ["icon"],
    template: `<a :class="'bi bi-'+icon+' icon-larger'" @click="$emit('click',$event);"></a>`
});