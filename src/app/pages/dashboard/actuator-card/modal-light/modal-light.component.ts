import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColorEvent } from 'ngx-color';
import { Options, ChangeContext } from 'ng5-slider';

import { ModalService } from '../modal-content.service';
import { LightRGB } from '../../../../@core/data/device.model';
import { DevicesService } from '../../../../@core/data/device.service';

@Component({
  selector: 'ngbd-modal-content',
  styleUrls: ['./modal-light.component.scss'],
  templateUrl: './modal-light.component.html'
})
export class ModalLightComponent {
  lightState: boolean;//: boolean = true;
  @Input() device: LightRGB;

  colorState = {
    hex: '#f00', // Rojo
    rgb: {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    hsl: {
      h: 0,
      s: 1,
      l: 0.5, //Saturacion
      a: 1,
    },
  };

  saturacion: number = 100;
  intensidad: number = 100;

  optionsSat: Options = {
    floor: 0,
    ceil: 100,
    disabled: false,
    showSelectionBar: true
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
    this.colorState.hsl.h = this.device['hs_color']['h'];
    this.colorState.hsl.s = this.device['hs_color']['s']/100.0;
    this.saturacion = this.device['hs_color']['s'];
    this.lightState = this.device['state'] == 'on';
    
    if (!this.lightState) this.colorState.hex = '#808080';
    else this.refreshStateColors();
    
    this.intensidad = this.device['brightness']*100/256;

    this.optionsSat = Object.assign({}, this.optionsSat, {disabled: !this.lightState});
    this.optionsInt = Object.assign({}, this.optionsInt, {disabled: !this.lightState});
  }

  // Maneja el cambio del Hue Picker, llamado al detenerse la selección y luego manda a BD
  hueChangeComplete($event: ColorEvent) {
    this.colorState = $event.color;
    this.colorState.hsl.l = 1 - this.saturacion/200.0; // Rango real: 0.5 (color) a 1 (blanco) invertido
    this.refreshStateColors();
    this.device['hs_color']['h'] = this.colorState.hsl.h;
    this.device['hs_color']['s'] = this.saturacion;
    this.deviceService.updateLightRGB(this.device, "hs_color");

  }

  // Cambios de slider de Saturación, al soltar el click, manda a BD
  onUserChangeSat($event: ChangeContext) {
    this.colorState.hsl.l = 1 - $event.value/200.0;
    this.refreshStateColors();
    this.device['hs_color']['h'] = this.colorState.hsl.h;
    this.device['hs_color']['s'] = this.saturacion;
    this.deviceService.updateLightRGB(this.device, "hs_color");
  }

  // Cambios de slider de Intensidad (Brillo), al soltar el click, manda a BD
  onUserChangeInt($event: ChangeContext) {
    // Pasar directamente a Firebase
    this.device['brightness'] = $event.value;
    this.deviceService.updateLightRGB(this.device, "brightness");
  }

  // Actualiza el color del Header del modal en tiempo real
  hueHeader($event: ColorEvent) {
    this.colorState = $event.color;
    this.colorState.hsl.l = 1 - this.saturacion/200.0; // Rango real: 0.5 (color) a 1 (blanco) invertido
    this.refreshStateColors();
    this.device['hs_color']['h'] = this.colorState.hsl.h;
    this.device['hs_color']['s'] = this.saturacion;
  }

  // Actualiza la saturación del Header del modal en tiempo real
  satHeader($event: ChangeContext) {
    this.colorState.hsl.l = 1 - $event.value/200.0;
    this.refreshStateColors();
    this.device['hs_color']['h'] = this.colorState.hsl.h;
    this.device['hs_color']['s'] = this.saturacion;
  }

  /* Due to the way Angular 2+ handles change detection, we have to create a new options object.
  Al presionarse el toggle switch de encendido/apagado, se instaura un color plomo el modal,
  se deshabilitan los sliders y se oculta el hue picker*/
  onChangeDisabled(): void {
    if (this.lightState) this.colorState.hex = '#808080';
    else this.refreshStateColors();
    this.optionsSat = Object.assign({}, this.optionsSat, {disabled: this.lightState});
    this.optionsInt = Object.assign({}, this.optionsInt, {disabled: this.lightState});
    this.customService.lightStateChange.emit(this.lightState ? 'on' : 'off');
    this.device['state'] = this.lightState ? 'off' : 'on';
    this.deviceService.updateLightRGB(this.device, 'state');
  }

  // Sincroniza los tres estados de la var. colorState (hex, hsl y rgb)
  refreshStateColors() {
    var h = this.colorState.hsl.h / 360;
    var s = this.colorState.hsl.s;
    var l = this.colorState.hsl.l;

    if (s === 0) {
      this.colorState.rgb.r = this.colorState.rgb.g = this.colorState.rgb.b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      this.colorState.rgb.r = hue2rgb(p, q, h + 1 / 3);
      this.colorState.rgb.g = hue2rgb(p, q, h);
      this.colorState.rgb.b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    this.colorState.hex = `#${toHex(this.colorState.rgb.r)}${toHex(this.colorState.rgb.g)}${toHex(this.colorState.rgb.b)}`;
    this.colorState.rgb.r = Math.round(this.colorState.rgb.r * 255);
    this.colorState.rgb.g = Math.round(this.colorState.rgb.g * 255);
    this.colorState.rgb.b = Math.round(this.colorState.rgb.b * 255);
  }
}