<template>
    <div>
        <iframe :src="notebookSrc" id="notebook-iframe" scrolling="no" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: 'notebook',
    data () {
        return {
            notebookSrc: 'https://docs.offline.fandow.com/'
        };
    },
    mounted () {
        window.onresize = () => {
            const notebookIframe = document.getElementById('notebook-iframe');
            notebookIframe.width = document.documentElement.clientWidth - 240;
            notebookIframe.height = document.documentElement.clientHeight - 100;
        };
        window.onresize();
    }
};
</script>
