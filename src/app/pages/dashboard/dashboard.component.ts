import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DevicesService } from '../../@core/data/device.service';
import { Switch, NumericSensor, Sensor, LightRGB, LightWTA } from '../../@core/data/device.model';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  isServerActive: boolean;
  lightsRGB: LightRGB[];
  lightsWTA: LightWTA[];
  switches: Switch[];
  num_sensors: NumericSensor[];
  sensors: Sensor[];

  constructor(private deviceService: DevicesService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://domoticapruebalithium.firebaseio.com/user/us1/group.json').subscribe(async data => {
      var id;
      id = data as string;

      this.deviceService.getActive(id).valueChanges().subscribe(item => {
        this.isServerActive = item;
      })

      this.deviceService.getActuatorsData(id).snapshotChanges()
      .subscribe(item => {
        // Se recibe el Stream de Firebase como Item
        this.lightsRGB = [];
        this.lightsWTA = [];
        this.switches = [];
        
        item.forEach(element => {
          var device = element.payload.toJSON();
          device['$key'] = element.key;
          if (device['typeComponent'] == 'light_rgb') this.lightsRGB.push(device as LightRGB);
          else if (device['typeComponent'] == 'light_wta') this.lightsWTA.push(device as LightWTA);
          else if (device['typeComponent'] == 'switch') this.switches.push(device as Switch);
        });
      });

      this.deviceService.getSensorsData(id).snapshotChanges()
      .subscribe(item => {

        this.num_sensors = [];
        this.sensors = [];

        item.forEach(element => {
          var sensor = element.payload.toJSON();
          sensor['$key'] = element.key;
          if (sensor['typeComponent'] == 'num_sensor') this.num_sensors.push(sensor as NumericSensor);
          else if (sensor['typeComponent'] == 'binary_sensor') this.sensors.push(sensor as Sensor);
        });
      });
    });



    
  }

}


