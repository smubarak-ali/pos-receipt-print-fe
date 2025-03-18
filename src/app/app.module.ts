import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { MedicineManagementComponent } from './page/medicine-management/medicine-management.component';
import { ReceiptFormComponent } from './page/receipt-form/receipt-form.component';
import { HtmlImageComponent } from './components/html-image/html-image.component';

@NgModule({
  declarations: [
    AppComponent,
    MedicineManagementComponent,
    ReceiptFormComponent,
    HtmlImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
