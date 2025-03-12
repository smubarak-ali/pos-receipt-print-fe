import { Component, inject, OnInit, signal } from '@angular/core';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { MedicineService } from '../../service/medicine.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-medicine-management',
  standalone: false,
  templateUrl: './medicine-management.component.html',
  styleUrl: './medicine-management.component.scss'
})
export class MedicineManagementComponent implements OnInit {
  private destroy$ = injectDestroy();
  private readonly medicineService = inject(MedicineService);

  medicineName = signal('');

  ngOnInit() {

  }

  get medicines() {
    return this.medicineService.medicines;
  }

  addMedicine(event: MouseEvent) {
    event.preventDefault();
    this.medicineService.addMedicine({ name: this.medicineName(), id: 0 })
      .pipe(take(1))
      .subscribe(() => {
        this.medicineService.loadMedicines();
        this.medicineName.set('');
      });
  }

  deleteMedicine(id: number) {
    this.medicineService.deleteMedicine(id)
      .pipe(take(1))
      .subscribe(() => {
        this.medicineService.loadMedicines();
      });
  }

}
