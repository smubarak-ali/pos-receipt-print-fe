import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

 
export function greaterThan(val: number): ValidatorFn {
 
    return (control: AbstractControl): ValidationErrors | null => {
   
      let v: number = +control.value;
   
      if (isNaN(v)) {
        return { 'greaterThan': true, 'requiredValue': val }
      }      
   
      if (v <= +val) {
        return { 'greaterThan': true, 'requiredValue': val }
      } 
        
      return null;
      
    }
   
  }