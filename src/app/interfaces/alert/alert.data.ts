import { ModalButton } from "../modal.button";

export interface AlertData {
    title?: string,
    message: string,
    time?: number,
    buttons?: ModalButton[]
}