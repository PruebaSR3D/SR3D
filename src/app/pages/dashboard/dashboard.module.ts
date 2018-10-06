import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { ActuatorCardComponent } from './actuator-card/actuator-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { TeamComponent } from './team/team.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { WeatherComponent } from './weather/weather.component';
import { SolarComponent } from './solar/solar.component';
import { PlayerComponent } from './rooms/player/player.component';
import { TrafficComponent } from './traffic/traffic.component';
import { TrafficChartComponent } from './traffic/traffic-chart.component';

import { ModalComponent } from '../ui-features/modals/modal/modal.component';
import { ModalLightComponent } from './actuator-card/modal-light/modal-light.component';
import { ModalLightWTAComponent } from './actuator-card/modal-light-wta/modal-light-wta.component';
import { ColorPickerModule } from 'ngx-color-picker';

import { ColorHueModule } from 'ngx-color/hue';
import { Ng5SliderModule } from 'ng5-slider';
import { UiSwitchModule } from 'ngx-toggle-switch';

import { ModalService } from './actuator-card/modal-content.service';
import { SensorCardComponent } from './sensor-card/sensor-card.component';

import { HttpClientModule } from '@angular/common/http';

import { SensorValuePipe } from '../../@theme/pipes/sensor-value.pipe';


@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    ColorPickerModule,
    ColorHueModule,
    Ng5SliderModule,
    UiSwitchModule,
    HttpClientModule
  ],
  declarations: [
    DashboardComponent,
    ActuatorCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    SolarComponent,
    TrafficComponent,
    TrafficChartComponent,
    ModalComponent,
    ModalLightComponent,
    SensorCardComponent,
    ModalLightWTAComponent,
    SensorValuePipe
  ],
  entryComponents: [
    ModalComponent,
    ModalLightComponent,
    ModalLightWTAComponent
  ],
  providers: [
    ModalService
  ],
})
export class DashboardModule { }
