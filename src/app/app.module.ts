import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPrinterModule } from "ngx-printer";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MedicineManagementComponent } from './page/medicine-management/medicine-management.component';
import { ReceiptFormComponent } from './page/receipt-form/receipt-form.component';
import { PrintOutComponent } from './page/print-out/print-out.component';

@NgModule({
  declarations: [
    AppComponent,
    MedicineManagementComponent,
    ReceiptFormComponent,
    PrintOutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    NgxPrinterModule.forRoot({ printOpenWindow: false, printPreviewOnly: false })
  ],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
