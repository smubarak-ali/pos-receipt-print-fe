import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';


import { PrintOutRouteState } from '../../utils/objects/route';

@Component({
  selector: 'app-print-out',
  standalone: false,
  templateUrl: './print-out.component.html',
  styleUrl: './print-out.component.scss'
})
export class PrintOutComponent implements OnInit {

  private readonly location = inject(Location);

  data: PrintOutRouteState | undefined = undefined;

  ngOnInit() {
    this.data = this.location.getState() as PrintOutRouteState;
    console.log(this.data);
  }

}
