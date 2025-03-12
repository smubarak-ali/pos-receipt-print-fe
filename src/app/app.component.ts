import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { MedicineService } from './service/medicine.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private destroy$ = injectDestroy();
  private readonly medicineService = inject(MedicineService);

  public form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    this.addRow(); // Initialize with one row
  }

  ngOnInit() {
    this.medicineService.loadMedicines();
  }

  get medicines() {
    return this.medicineService.medicines;
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      medicine: [''],
      quantity: [''],
      price: [''],
      gstRate: [''],
      gst: [''],
      total: ['']
    });
    this.rows.push(row);
  }

  removeLastRow() {
    if (this.rows.length > 1) {
      this.rows.removeAt(this.rows.length - 1);
    }
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
