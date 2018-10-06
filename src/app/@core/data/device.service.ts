import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { LightRGB, LightWTA, Switch } from './device.model';
import 'rxjs/add/operator/take';

@Injectable()
export class DevicesService {

  actuatorList: AngularFireList<any>;
  sensorList: AngularFireList<any>;
  isServerActive: AngularFireObject<any>;
  userID: string = "us1"; // Cambiar por usuario real con login en Gmail.
  groupID: string;
  route: string = 'group/';
  routeOK = false;

  constructor(private firebase: AngularFireDatabase) {
  }

  getActive(id) {
    this.isServerActive = this.firebase.object('group/'+id+'/active');
    return this.isServerActive;
  }

  getActuatorsData(id) {
    //this.actuatorList = this.firebase.list('group/'+this.groupID+'/actuator');
    this.actuatorList = this.firebase.list('group/'+id+'/actuator');
    return this.actuatorList;
  }

  getSensorsData(id) {
    //this.sensorList = this.firebase.list('group/'+this.groupID+'/sensor');
    this.sensorList = this.firebase.list('group/'+id+'/sensor');
    return this.sensorList;
  }

  updateLightRGB(device: LightRGB, param: string) {
    var value = (param == 'brightness') ? device[param]*255/100.0 : device[param];
    this.actuatorList.set(`${device.$key}/${param}`, value);
  }

  updateLightWTA(device: LightWTA, param: string) {
    var value = (param == 'brightness') ? device[param]*255/100.0 : device[param];
    this.actuatorList.set(`${device.$key}/${param}`, value);
  }

  updateSwitch(device: Switch) {
    /*this.actuatorList.update(device.$key,
      {
        state: device.state
      });*/
    this.actuatorList.set(`${device.$key}/state`, device.state);
  }

  /*deleteEmployee($key : string){
    this.deviceList.remove($key);
  }*/

}