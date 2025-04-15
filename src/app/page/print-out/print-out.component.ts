import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChild, ViewEncapsulation } from '@angular/core';


import { AppRoutes, PrintOutRouteState } from '../../utils/objects/route';
import { getRandomNumber } from '../../utils/helper/number.helper';
import { environment } from '../../../environments/environment';
import { NgxPrinterService } from 'ngx-printer';

@Component({
  selector: 'app-print-out',
  standalone: false,
  templateUrl: './print-out.component.html',
  styleUrl: './print-out.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintOutComponent implements OnInit {

  private readonly location = inject(Location);
  private readonly printService = inject(NgxPrinterService);
  readonly pakPrintDiv = viewChild<ElementRef>("pakPrintDiv");

  data: PrintOutRouteState | undefined = undefined;
  devagoRoute = AppRoutes.DEVAGO;
  pakMedicalRoute = AppRoutes.PAK_MEDICAL;

  get getInvoiceNo() {
    return getRandomNumber();
  }

  ngOnInit() {
    this.data = this.location.getState() as PrintOutRouteState;
    console.log(this.data);
  }

  getDiscountedAmount(value: number) {
    return value * environment.discount / 100;
  }

  printPakMedicalReceipt() {
    this.printService.printHTMLElement(this.pakPrintDiv()?.nativeElement);
  }

}
