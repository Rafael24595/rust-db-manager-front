import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ModalButton } from '../../interfaces/modal.button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-combo-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combo.selector.component.html',
  styleUrl: './combo.selector.component.css'
})
export class ComboSelectorComponent {

  @ViewChild('combo') combo!: ElementRef<HTMLDialogElement>;

  @Input() options: ModalButton[];

  public status: boolean;

  constructor(private elementRef: ElementRef) {
    this.options  = [];
    this.status = false;
  }

  switchStatus() {
    this.status = !this.status;
  }

  execute(func: Function, args?: any) {
    func(args);
    this.status = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.status = false
    }
  }

}
