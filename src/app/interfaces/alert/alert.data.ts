import { ModalButton } from "../modal.button";

export interface AlertData {
    title?: string,
    icon?: string,
    message: string,
    time?: number,
    color?: string,
    buttons?: ModalButton[]
}