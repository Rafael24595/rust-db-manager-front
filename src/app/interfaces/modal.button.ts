import { Callback } from "./callback"

export interface ModalButton {
    title: string,
    callback: Callback,
    close?: boolean,
    icon?: {
        icon: string,
        color?: string
    }
}