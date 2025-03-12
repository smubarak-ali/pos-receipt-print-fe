import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { MedicineManagementComponent } from './page/medicine-management/medicine-management.component';
import { ReceiptFormComponent } from './page/receipt-form/receipt-form.component';

@NgModule({
  declarations: [
    AppComponent,
    MedicineManagementComponent,
    ReceiptFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
