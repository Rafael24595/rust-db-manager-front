import { Callback } from "./callback";

export interface ServiceSuscribe {
    service: string;
    nextCallback?: Callback;
    exitCallback?: Callback;
}