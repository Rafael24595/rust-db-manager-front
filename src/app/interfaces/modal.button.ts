import { Callback } from "./callback"

export interface ModalButton {
    title: string,
    callback: Callback,
    icon?: {
        icon: string,
        color?: string
    }
}