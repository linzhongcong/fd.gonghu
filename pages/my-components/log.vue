<template>
    <Row>
        <Table 
                :columns="columns" 
                :data="listData.data" 
                border width="100%" highlight-row 
                :loading="listData.loading" 
                size="small"
        >
        </Table>
        <div style="margin: 10px;overflow: hidden">
            <div class="pages-L">共 {{page.totalCount}} 条</div>
            <div style="float: right;">
                <Page 
                :total="page.totalCount" 
                :current="page.currentPage" 
                size="small"
                show-sizer @on-change="changePage" 
                @on-page-size-change="changePageSize">
                </Page>
            </div>
        </div>
    </Row>
</template>

<script>
export default {
    name: 'log',
    data () {
        return {
            columns: [
                { key: 'index', type: 'index', title: '序号', width: 65, align: 'center' },
                { key: 'created_by', title: '操作人', width: 120, align: 'center' },
                { key: 'comment', title: '修改内容', align: 'center' },
                { key: 'status', title: '流程状态', width: 120, align: 'center' },
                { key: 'created_at',
                    title: '时间',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', this.formatDate(params.row.created_at));
                    }
                }
            ]
        };
    },
    props: {
        listData: Object,
        page: Object
    },
    methods: {
        changePage (e) {
            this.$emit('log-page', e);
        },
        changePageSize (e) {
            this.$emit('log-page-size', e);
        },
        formatDate (time) {
            return this.$format(time, 'h:mm');
        }
    }
};
</script>
