import { Callback } from "./callback"

export interface ModalButton {
    title: String,
    callback: Callback<any>,
    icon?: {
        icon: string,
        color?: string
    }
}