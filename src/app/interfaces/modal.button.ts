import { Callback } from "./callback"

export interface ModalButton {
    title: String,
    callback: Callback,
    icon?: {
        icon: string,
        color?: string
    }
}