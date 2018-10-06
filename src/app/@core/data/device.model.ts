class Device {
    $key: string;
    entity_id: string;
    name: string;
    typeColor: string;
    typeComponent: string;
}

class Light extends Device {
    state: string;
    brightness: number;
}

export class LightRGB extends Light {
    hs_color: {
        h: number;
        s: number;
    }
}

export class LightWTA extends Light {
    color_temp: number;
    min_temp: number;
    max_temp: number;
}

export class Switch extends Device {
    state: string;
    temperature: number;
}

export class Sensor extends Device {
    value: string;
    icon: string;
}

export class NumericSensor extends Sensor {
    unit: string;
}