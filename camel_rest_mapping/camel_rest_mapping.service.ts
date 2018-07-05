import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class Camel_rest_mappingService {

  constructor(private http: HttpClient) { }

  // 新建
  create(inJson: any): Observable<any> {
    const url = "/camel_rest_mappingservice/create";
    return this.http.post(url, inJson);
  }

  // 列表
  list(paging: any): Observable<any> {
    const url = "/camel_rest_mappingservice/query";
    let params = new HttpParams()
      .set('sysAppVOStr', "{}")
      .set('page', paging.pi)
      .set('results', paging.ps);

    return this.http.get(url, { params: params });
  }

  // 删除
  del(inJson: any): Observable<any> {
    const url = "/camel_rest_mappingservice/delete";
    return this.http.post(url, inJson);
  }

  // 编辑
  edit(inJson: any): Observable<any> {
    const url = "/camel_rest_mappingservice/update";
    return this.http.post(url, inJson);
  }

}
