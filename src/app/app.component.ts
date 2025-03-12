import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { MedicineService } from './service/medicine.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  
}
