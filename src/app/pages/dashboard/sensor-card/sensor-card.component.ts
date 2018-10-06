import { Component, OnInit, Input } from '@angular/core';

import { NumericSensor, Sensor } from '../../../@core/data/device.model';
@Component({
  selector: 'ngx-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.scss']
})
export class SensorCardComponent {

  @Input() device: any;

  //binaryState: string;

  constructor() { }

  /*ngOnInit() {
    if (this.device['entity_id'].split(".")[0] != 'sensor') {
      this.binaryState = (this.device.value) ? 'Abierto' : 'Cerrado';
    }
  }*/

}
