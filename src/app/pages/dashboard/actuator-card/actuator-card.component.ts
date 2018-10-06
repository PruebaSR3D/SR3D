import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalLightComponent } from './modal-light/modal-light.component';
import { ModalLightWTAComponent } from './modal-light-wta/modal-light-wta.component';
import { ModalService } from './modal-content.service';

import { DevicesService } from '../../../@core/data/device.service';
import { Switch, LightRGB, LightWTA } from '../../../@core/data/device.model';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./actuator-card.component.scss'],
  template: `
    <nb-card (click)="onCardClick()"
    [ngClass]="{'off': this.device['state'] != 'on'}" (lightStateChange)="this.device['state'] = $event">
      <div class="icon-container">
        <div class="icon {{ device['typeColor'] }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{ device['name'] }}</div>
        <div class="status">{{ this.device['state'] == 'on' ? 'ENCENDIDO' :
        this.device['state'] == 'off' ? 'APAGADO' : 'NO DISPONIBLE' }}</div>
      </div>
    </nb-card>
  `,
})
export class ActuatorCardComponent {

  @Input() device: any;
  @Input() disabled: boolean;
  on: boolean;
  status: string;

  constructor(private modalService: NgbModal, private customService: ModalService,
  private deviceService: DevicesService/*, private modalLight: ModalLightComponent,
  private modalLightWTA: ModalLightWTAComponent*/) { }

  ngOnInit() {
    switch (this.device['typeComponent']) {
      case 'light_rgb':
        this.device = this.device as LightRGB;
        break;

      case 'light_wta':
        this.device = this.device as LightWTA;
        break;

      case 'switch':
        this.device = this.device as Switch;
        break;
    }
    this.on = this.device['state'] == 'on';
    this.status = this.device['state'] == 'on' ? 'ENCENDIDO' :
      this.device['state'] == 'off' ? 'APAGADO' : 'NO DISPONIBLE';
  }

  onCardClick() {
    if (this.device['state'] != 'unavailable') {
      switch (this.device['typeComponent']) {
        case 'light_rgb':
          this.showModal('rgb'); // Deberia llamar a showModalRGB...
          break;
  
        case 'light_wta':
          this.showModal('wta'); // Deberia llamar a showModalWTA...
          break;
  
        case 'switch':
          this.toggleOn();
          break;
      }
    }
  }

  toggleOn() {
    this.device['state'] = this.device['state'] == 'off' ? 'on' : 'off';
    this.deviceService.updateSwitch(this.device);
  }

  showModal(modalType: any) {
    const activeModal = this.modalService.open(modalType == 'wta' ? ModalLightWTAComponent : ModalLightComponent, {
      backdrop: 'static'});

    activeModal.componentInstance.device = this.device;
    
    this.customService.lightStateChange
    .subscribe((lightState) => {
      this.device['state'] = !lightState
    })
  }
}
