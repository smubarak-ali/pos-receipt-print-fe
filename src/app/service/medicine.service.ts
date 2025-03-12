import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { Medicine } from '../utils/model/medicine';
import { patchState, signalState } from '@ngrx/signals';

interface State {
  medicines: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private readonly state = signalState<State>({
    medicines: [],
  });
  private readonly BASE_URL = "http://localhost:8000/api";
  private readonly http = inject(HttpClient);

  get medicines() {
    return this.state.medicines;
  }

  loadMedicines() {
    this.http.get<Medicine[]>(`${this.BASE_URL}/v1/medicine`)
      .pipe(take(1))
      .subscribe(medicines => {
        patchState(this.state, (prev) => ({
          ...prev,
          medicines: medicines.map(medicine => medicine.name),
        })
        );
      });
  }

}
