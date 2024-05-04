import { Callback } from "./callback";

export interface ServiceSuscribe {
    service: string;
    suscribeCallback?: Callback<any>;
    closeCallback?: Callback<any>;
}