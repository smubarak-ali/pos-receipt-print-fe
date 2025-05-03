import {
  Component,
  effect,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import numbro from 'numbro';

import { Medicine } from '../../utils/model/medicine';
import { MedicineService } from '../../service/medicine.service';
import { greaterThan } from '../../utils/custom-validator/greaterThan';

@Component({
  selector: 'app-medicine-management',
  standalone: false,
  templateUrl: './medicine-management.component.html',
  styleUrl: './medicine-management.component.scss',
})
export class MedicineManagementComponent implements OnDestroy {
  private readonly medicineService = inject(MedicineService);
  private readonly formBuilder = inject(FormBuilder);
  private unsub$ = new Subject();

  filteredList = signal<Medicine[] | undefined>(undefined);
  form!: FormGroup;
  searchForm!: FormGroup;
  searchQuery = new FormControl('');

  constructor() {
    this.initForm();

    this.searchQuery.valueChanges
      .pipe(takeUntil(this.unsub$), debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          const filtered = this.medicines().filter((x) =>
            x.name.toLowerCase().startsWith(value.toLowerCase())
          );
          this.filteredList.set(filtered);
        } else {
          this.filteredList.set(undefined);
        }
      });
  }

  ngOnDestroy() {
    this.unsub$.next(null);
    this.unsub$.complete();
  }

  get medicines() {
    return this.medicineService.medicines;
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    const medicine: Medicine = {
      id: 0,
      name: this.form.controls['name']?.value,
      price: this.form.controls['price']?.value,
    };

    this.addMedicine(medicine);
  }

  addMedicine(medicine: Medicine) {
    this.medicineService
      .addMedicine(medicine)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.medicineService.loadMedicines();
        },
        complete: () => {
          this.searchQuery.setValue(null);
          this.initForm();
        },
      });
  }

  deleteMedicine(id: number) {
    this.medicineService
      .deleteMedicine(id)
      .pipe(take(1))
      .subscribe(() => {
        this.medicineService.loadMedicines();
      });
  }

  formatNumber(val: number) {
    return numbro(val).format({ mantissa: 2 });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('0', [Validators.required, greaterThan(0)]),
    });

    this.searchForm = this.formBuilder.group({
      searchQuery: this.searchQuery,
    });
  }
}
