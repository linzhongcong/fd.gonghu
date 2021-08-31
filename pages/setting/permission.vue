<template>
    <div class="permission">
        <iframe :src="iframeSrc" id="iframepage" frameborder="0"></iframe>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config';
export default {
    name: 'permission',
    data () {
        return {
            iframeSrc: ''
        };
    },
    mounted () {
        const accessToken = Cookies.get('authorization');
        this.iframeSrc = `${SERVER_BASE_URL}/v1/user/admin?access-token=${accessToken.substr(7, accessToken.length)}`;
        window.onresize = () => {
            const ifm = document.getElementById('iframepage');
            ifm.width = document.documentElement.clientWidth - 240;
            ifm.height = document.documentElement.clientHeight;
        };
        window.onresize();
    }
};
</script>
