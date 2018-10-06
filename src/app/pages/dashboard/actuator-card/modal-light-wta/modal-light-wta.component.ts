import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColorEvent } from 'ngx-color';
import { Options, ChangeContext } from 'ng5-slider';

import { ModalService } from '../modal-content.service';
import { LightRGB, LightWTA } from '../../../../@core/data/device.model';
import { DevicesService } from '../../../../@core/data/device.service';

@Component({
  selector: 'ngbd-modal-content-wta',
  styleUrls: ['./modal-light-wta.component.scss'],
  templateUrl: './modal-light-wta.component.html'
})
export class ModalLightWTAComponent {
  lightState: boolean;//: boolean = true;
  @Input() device: LightWTA;

  color: number = 175;
  intensidad: number = 100;

  green = 191;
  blue = 0;
  hex = '';

  optionsColor: Options = {
    floor: 175,
    ceil: 333,
    disabled: false,
    translate: (value: number): string => {
      //return '';
      if (value >= 320) return 'Ámbar';
      else if (value <= 190) return 'Blanco';
      else return '';
    }
  };

  optionsInt: Options = {
    floor: 1,
    ceil: 100,
    disabled: false,
    showSelectionBar: true
  };

  constructor(public activeModal: NgbActiveModal, private customService: ModalService, private deviceService: DevicesService) {}

  ngOnInit() {
    // Se sincronizan los estados del Modal con los de la Base de datos
    this.color = this.device['color_temp'];
    this.lightState = this.device['state'] == 'on';

    this.color = this.device['color_temp'];
    
    if (!this.lightState) this.hex = '#808080';
    else {
      this.hex = this.miredsToHex(this.device['color_temp']);
    }
    
    this.intensidad = this.device['brightness']*100/256;

    this.optionsColor = Object.assign({}, this.optionsColor, {disabled: !this.lightState});
    this.optionsInt = Object.assign({}, this.optionsInt, {disabled: !this.lightState});
  }

  // Cambios de slider de Saturación, al soltar el click, manda a BD
  onUserChangeSat($event: ChangeContext) {
    this.device['color_temp'] = $event.value;
    this.deviceService.updateLightWTA(this.device, "color_temp");
  }

  // Cambios de slider de Intensidad (Brillo), al soltar el click, manda a BD
  onUserChangeInt($event: ChangeContext) {
    // Pasar directamente a Firebase
    this.device['brightness'] = $event.value;
    this.deviceService.updateLightWTA(this.device, "brightness");
  }

  // Actualiza el color del Header del modal en tiempo real
  hueHeader($event: ColorEvent) {
  }

  // Actualiza la saturación del Header del modal en tiempo real
  satHeader($event: ChangeContext) {
    this.hex = this.miredsToHex($event.value);
    
  }


  /* Due to the way Angular 2+ handles change detection, we have to create a new options object.
  Al presionarse el toggle switch de encendido/apagado, se instaura un color plomo el modal,
  se deshabilitan los sliders y se oculta el hue picker*/
  onChangeDisabled(): void {
    if (this.lightState) this.hex = '#808080';
    this.optionsColor = Object.assign({}, this.optionsColor, {disabled: this.lightState});
    this.optionsInt = Object.assign({}, this.optionsInt, {disabled: this.lightState});
    this.customService.lightStateChange.emit(this.lightState ? 'on' : 'off');
    this.device['state'] = this.lightState ? 'off' : 'on';
    this.deviceService.updateLightWTA(this.device, 'state');
  }

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  miredsToHex (mireds) {
    var kelvin = 1000000.0/mireds;
    kelvin = kelvin / 100
    var red, blue, green
  
    if (kelvin <= 66) {
      red = 255
    } else {
      red = kelvin - 60
      red = 329.698727466 * Math.pow(red, -0.1332047592)
      if (red < 0) {
        red = 0
      }
      if (red > 255) {
        red = 255
      }
    }
  
    if (kelvin <= 66) {
      green = kelvin
      green = 99.4708025861 * Math.log(green) - 161.1195681661
      if (green < 0) {
        green = 0
      }
      if (green > 255) {
        green = 255
      }
    } else {
      green = kelvin - 60
      green = 288.1221695283 * Math.pow(green, -0.0755148492)
      if (green < 0) {
        green = 0
      }
      if (green > 255) {
        green = 255
      }
    }
  
    if (kelvin >= 66) {
      blue = 255
    } else {
      if (kelvin <= 19) {
        blue = 0
      } else {
        blue = kelvin - 10
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307
        if (blue < 0) {
          blue = 0
        }
        if (blue > 255) {
          blue = 255
        }
      }
    }
  
    return this.rgbToHex(Math.floor(red), Math.floor(green), Math.floor(blue));
  }
}