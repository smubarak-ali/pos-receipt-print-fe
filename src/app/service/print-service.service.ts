import { inject, Injectable } from '@angular/core';
import { PrintRequest } from '../utils/model/print';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrintServiceService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  constructor() { }

  printDevagoReceipt(print: PrintRequest) {
    return this.http.post(`${this.baseUrl}/v1/print/d`, print);
  }
}
