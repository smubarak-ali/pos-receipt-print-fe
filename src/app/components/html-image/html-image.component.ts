import { Component, input, ViewEncapsulation } from '@angular/core';
import { PrintRequest } from '../../utils/model/print';
import numbro from 'numbro';

@Component({
  selector: 'app-html-image',
  standalone: false,
  templateUrl: './html-image.component.html',
  styleUrl: './html-image.component.scss'
})
export class HtmlImageComponent {
  data = input.required<PrintRequest>();

  formatNumber(val: number) {
    return numbro(val).format({ mantissa: 2 });
  }

}
