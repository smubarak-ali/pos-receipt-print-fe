import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MedicineManagementComponent } from './page/medicine-management/medicine-management.component';
import { ReceiptFormComponent } from './page/receipt-form/receipt-form.component';

const routes: Routes = [
  {
    path: "",
    component: ReceiptFormComponent
  },
  {
    path: "medicine",
    component: MedicineManagementComponent
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
