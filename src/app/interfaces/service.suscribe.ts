import { Callback } from "./callback";

export interface ServiceSuscribe {
    service: string;
    suscribeCallback?: Callback;
    closeCallback?: Callback;
}