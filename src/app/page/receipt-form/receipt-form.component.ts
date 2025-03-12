import { Component, inject, OnInit } from '@angular/core';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { MedicineService } from '../../service/medicine.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-form',
  standalone: false,
  templateUrl: './receipt-form.component.html',
  styleUrl: './receipt-form.component.scss'
})
export class ReceiptFormComponent implements OnInit {
  private destroy$ = injectDestroy();
  private readonly medicineService = inject(MedicineService);
  
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    this.addRow();
  }

  ngOnInit() {
    this.medicineService.loadMedicines();
  }

  get medicines() {
    return this.medicineService.medicines;
  }

  get rows() {
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
