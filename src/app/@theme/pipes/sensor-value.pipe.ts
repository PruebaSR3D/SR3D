import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sensorValue' })
export class SensorValuePipe implements PipeTransform {

  transform(sensor: any): string {
    if (sensor.value == 'unavailable') return 'No disponible';
    if (sensor['entity_id'].split('.')[0] == 'sensor') return `${sensor.value} ${sensor.unit}`;
    return (sensor.value == 'on') ? 'Abierto' : 'Cerrado';
  }
}
