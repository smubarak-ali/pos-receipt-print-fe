import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { injectDestroy } from 'ngxtension/inject-destroy';
import numbro from 'numbro';
import { distinctUntilChanged, takeUntil } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MedicineService } from '../../service/medicine.service';
import { PrintItems, PrintRequest } from '../../utils/model/print';
import { environment } from '../../../environments/environment';
import { greaterThan } from '../../utils/custom-validator/greaterThan';
import { PrintType } from '../../utils/objects/constants';
import { getRandomNumber } from '../../utils/helper/number.helper';

const printTemplates = new Map([
  [PrintType.ABDUL_HADI, 'hadi.html'],
  [PrintType.PAK_MEDICAL, 'pak-medical.html'],
  [PrintType.MDM, 'mdm.html'],
  [PrintType.ZIAUDDIN, 'zia.html'],
]);

@Component({
  selector: 'app-receipt-form',
  standalone: false,
  templateUrl: './receipt-form.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './receipt-form.component.scss',
})
export class ReceiptFormComponent implements OnInit {
  private destroy$ = injectDestroy();
  private readonly medicineService = inject(MedicineService);

  abdulHadiPrintType = PrintType.ABDUL_HADI;
  pakMedicalPrintType = PrintType.PAK_MEDICAL;
  ziaMedicalPrintType = PrintType.ZIAUDDIN;
  mdmPrintType = PrintType.MDM;

  form!: FormGroup;
  total = signal(0);
  discount = signal(0);
  printError = signal('');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: new FormControl(new Date(), [Validators.required]),
      printType: ['', [Validators.required]],
      rows: this.fb.array([]),
    });

    this.addRow();
  }

  async ngOnInit() {
    await this.medicineService.loadMedicines();
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

  onSubmit(event: Event) {
    event.preventDefault();
    this.printError.set('');
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

    const template = printTemplates.get(this.form.controls['printType'].value);
    if (template) {
      this.openPrintPreview(template, printRequest);
    }
  }

  private openPrintPreview(template: string, receipt: PrintRequest) {
    const url = new URL(template, document.baseURI);
    const preview = window.open(url.href, '_blank');
    if (!preview) {
      this.printError.set('Allow pop-ups for this site and click Print again.');
      return;
    }

    const listener = new AbortController();
    const timeout = window.setTimeout(() => {
      listener.abort();
      if (!preview.closed) {
        this.printError.set('The receipt preview did not load. Click Print to try again.');
      }
    }, 10_000);

    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin !== url.origin || event.source !== preview || event.data !== 'receipt-ready') {
        return;
      }

      window.clearTimeout(timeout);
      listener.abort();
      preview.postMessage({ type: 'receipt-data', receipt, discountRate: environment.discount }, url.origin);
    }, { signal: listener.signal });
  }

  formatNumber(val: number) {
    return numbro(val).format({ mantissa: 2 });
  }

  getDiscountedAmount(value: number) {
    return (value * environment.discount) / 100;
  }
}
