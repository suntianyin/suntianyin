import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Camel_rest_mappingService } from 'app/behavior/camel_rest_mapping/camel_rest_mapping.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
    genPath: string;
    selectedEnterprise: any;
    enterpriseList: any = [
        {id: 1, name: '安荣科技'},
        {id: 2, name: '测试'}
    ];

    selectedAutoGen: any;
    autoGenList: any = [
        {id: 1, name: '数据映射文件'},
        {id: 2, name: '业务逻辑(基础增删改成)'},
        {id: 3, name: '前端界面(ng-alain)'}
    ];

    q: any = {
        pi: 1,
        ps: 20,
        sorter: '',
        status: null,
        statusList: []
    };
    data: any[] = [];
    loading = false;
    selectedRows: any[] = [];
    curRows: any[] = [];
    totalCallNo = 0;
    allChecked = false;
    indeterminate = false;
    status = [
        { text: '关闭', value: false, type: 'default' },
        { text: '运行中', value: false, type: 'processing' },
        { text: '已上线', value: false, type: 'success' },
        { text: '异常', value: false, type: 'error' }
    ];
    sortMap: any = {};
    expandForm = false;
    modalVisible = false;
    modalVisible2 = false;
    modalVisible3 = false;

    id = "";
    name = "";
    description = "";
    url = "";
    sequence = "";

    constructor(private http: _HttpClient, public msg: NzMessageService, private camel_rest_mappingService: Camel_rest_mappingService) { }

    ngOnInit() {
        this.getData();

        this.camel_rest_mappingService.getEnterpriseList().subscribe(resp => {
            this.enterpriseList = resp.enterprises;

        }, error => {
            this.msg.error(error);
        });
    }

    getData() {
        this.q.statusList = this.status.map((i, index) => i.value ? index : -1).filter(w => w !== -1);
        if (this.q.status !== null && this.q.status > -1)
            this.q.statusList.push(this.q.status);

        this.camel_rest_mappingService.list(this.q).subscribe(resp => {
            if(resp.success)
                this.data = resp.results;
            else
                this.msg.error(resp.errorMsg);

        }, error => {
            this.msg.error(error);
        });
    }

    add() {
        this.modalVisible = true;
        this.description = '';
        this.name = "";
        this.sequence = "";
    }

    showEdit(id) {
        let obj: any;
        this.curRows.forEach(value => {
            if (value.id == id) {
                obj = value;
                return false;
            }
        });

        this.enterpriseList.forEach((value, index) => {            
            if(value.id == obj.enterpriseid) {
                this.selectedEnterprise = this.enterpriseList[index];
                return false;
            }
        });

        this.id = obj.id;
        this.name = obj.name;
        this.url = obj.url;
        this.description = obj.description;
        this.sequence = obj.sequence;

        this.modalVisible2 = true;
        this.selectedEnterprise = {};

    }

    edit() {
        this.loading = true;

        let inputData: any = {};
        inputData.id = this.id;
        inputData.enterpriseId = this.selectedEnterprise.id;
        inputData.name = this.name;
        inputData.url = this.url;
        inputData.description = this.description;
        inputData.sequence = this.sequence;

        this.camel_rest_mappingService.edit(inputData).subscribe(resp => {
            this.loading = false;
            if(resp.success)
                this.getData();
            else
                this.msg.error(resp.errorMsg);

        }), error => {
            this.loading = false;
            this.msg.error(error);
        };

    }

    save() {
        this.loading = true;

        let inputData: any = {};
        inputData.enterpriseId = this.selectedEnterprise.id;
        inputData.name = this.name;
        inputData.description = this.description;
        inputData.url = this.url;
        inputData.sequence = this.sequence;

        this.camel_rest_mappingService.create(inputData).subscribe(resp => {
            this.loading = false;
            if(resp.success)
                this.getData();
            else
                this.msg.error(resp.errorMsg);

        }, error => {
            this.loading = false;
            this.msg.error(error);
        });

    }

    remove(id) {
        /*
        this.http.delete('/rule', { nos: this.selectedRows.map(i => i.no).join(',') }).subscribe(() => {
            this.getData();
            this.clear();
        });
        */
        let obj: any;
        this.curRows.forEach(i => {
            if (i.id == id) {
                obj = i;
                return false;
            }
        });

        this.camel_rest_mappingService.del(obj).subscribe(resp => {
            console.log(resp);
            if (resp.success) {
                this.getData();
                this.clear();
            }
            else
                this.msg.error(resp.errorMsg);
        });
    }

    approval() {
        this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
    }

    clear() {
        this.selectedRows = [];
        this.totalCallNo = 0;
        this.data.forEach(i => i.checked = false);
        this.refreshStatus();
    }

    checkAll(value: boolean) {
        this.curRows.forEach(i => {
            if (!i.disabled) i.checked = value;
        });
        this.refreshStatus();
    }

    refreshStatus() {
        const allChecked = this.curRows.every(value => value.disabled || value.checked);
        const allUnChecked = this.curRows.every(value => value.disabled || !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = (!allChecked) && (!allUnChecked);
        this.selectedRows = this.data.filter(value => value.checked);
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
    }

    sort(field: string, value: any) {
        this.sortMap = {};
        this.sortMap[field] = value;
        this.q.sorter = value ? `${field}_${value}` : '';
        this.getData();
    }

    dataChange(res: any) {
        this.curRows = res;
        this.refreshStatus();
    }

    pageChange(pi: any) {
        this.q.pi = pi;
        this.getData();
    }

    reset(ls: any[]) {
        for (const item of ls) item.value = false;
        this.getData();
    }

}
