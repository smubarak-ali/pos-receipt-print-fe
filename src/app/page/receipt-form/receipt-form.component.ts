import { Component, inject, OnInit, signal } from '@angular/core';
import { injectDestroy } from 'ngxtension/inject-destroy';
import numbro from 'numbro';
import { distinctUntilChanged, take, takeUntil } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MedicineService } from '../../service/medicine.service';
import { PrintItems, PrintRequest } from '../../utils/model/print';
import { PrintServiceService } from '../../service/print-service.service';
import { environment } from '../../../environments/environment';
import { greaterThan } from '../../utils/custom-validator/greaterThan';
import { PrintType } from '../../utils/objects/constants';
import { getRandomNumber } from '../../utils/helper/number.helper';

@Component({
  selector: 'app-receipt-form',
  standalone: false,
  templateUrl: './receipt-form.component.html',
  styleUrl: './receipt-form.component.scss',
})
export class ReceiptFormComponent implements OnInit {
  private destroy$ = injectDestroy();
  private readonly medicineService = inject(MedicineService);
  private readonly printService = inject(PrintServiceService);

  abdulHadiPrintType = PrintType.ABDUL_HADI;
  pakMedicalPrintType = PrintType.PAK_MEDICAL;
  mdmPrintType = PrintType.MDM;

  form!: FormGroup;
  total = signal(0);
  discount = signal(0);
  printRequest = signal<PrintRequest>({} as PrintRequest);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: new FormControl(new Date(), [Validators.required]),
      printType: ['', [Validators.required]],
      rows: this.fb.array([]),
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
      medicine: ['', [Validators.required]],
      quantity: ['1', [Validators.required, greaterThan(0)]],
      price: ['0', [Validators.required, greaterThan(0)]],
      gstRate: ['0'],
      gst: ['0'],
      total: ['0', [Validators.required, greaterThan(0)]],
    });
    this.rows.push(row);

    row
      .get('medicine')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const selectedMedicine = this.medicines().find((x) => x.name === val);
          if (selectedMedicine) {
            row.get('price')?.setValue(`${selectedMedicine.price}`);
          }
        }
      });

    row
      .get('price')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        const quantity = row.get('quantity')?.value;
        if (!!quantity && !!value) {
          row.get('total')?.setValue(`${(+value * +quantity).toFixed(2)}`);
        }
      });

    row
      .get('quantity')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        const price = row.get('price')?.value;
        if (!!price && !!value) {
          row.get('total')?.setValue(`${(+value * +price).toFixed(2)}`);
        }
      });
  }

  removeLastRow() {
    if (this.rows.length > 1) {
      this.rows.removeAt(this.rows.length - 1);
    }
  }

  onTabPress(event: Event) {
    event.preventDefault();
    this.addRow();
  }

  async onSubmit() {
    const printItems = new Array<PrintItems>();
    let total = 0;
    this.form.value.rows.forEach((row: any) => {
      const printItem: PrintItems = {
        productName: row.medicine,
        gstAmount: row.gst,
        totalAmount: row.total,
        quantity: row.quantity,
        price: row.price,
        gstRate: row.gstRate,
      };
      total += +row.total;
      printItems.push(printItem);
    });

    const totalDiscount = (total * environment.discount) / 100;
    this.total.set(total);
    this.discount.set(totalDiscount);

    const printRequest: PrintRequest = {
      date: this.form.controls['date']?.value,
      items: printItems,
      totalAmount: this.formatNumber(this.total()),
      totalDiscount: this.formatNumber(this.discount()),
      posServiceFee: '0',
      charge: '0',
      netTotal: this.formatNumber(this.total() - this.discount()),
      invoiceNumber: getRandomNumber(),
    };

    this.printRequest.set(printRequest);

    localStorage.setItem('discount', `${environment.discount}`);

    if (this.form.controls['printType']?.value === this.pakMedicalPrintType) {
      localStorage.setItem('pak_medical_print', JSON.stringify(printRequest));
      window.open(`${environment.webUrl}/pak-medical.html`, '_blank');
    } 
    else if (
      this.form.controls['printType']?.value === this.abdulHadiPrintType
    ) {
      this.printReceipt();
    }
  }

  printReceipt() {
    this.printService
      .printDevagoReceipt(this.printRequest())
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.form = this.fb.group({
            date: new FormControl(new Date(), [Validators.required]),
            printType: ['', [Validators.required]],
            rows: this.fb.array([]),
          });
          this.addRow();
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.total.set(0);
          this.discount.set(0);
          // this.confirmModal()?.close();
          this.printRequest.set({} as PrintRequest);
        },
      });
  }

  formatNumber(val: number) {
    return numbro(val).format({ mantissa: 2 });
  }

  getDiscountedAmount(value: number) {
    return (value * environment.discount) / 100;
  }
}
