import { Callback } from "./callback";

export interface AuthAction {
    key: string;
    name: string;
    service: string;
    nextCallback?: Callback;
    exitCallback?: Callback;
}