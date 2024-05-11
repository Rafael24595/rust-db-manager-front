import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ModalButton } from '../../interfaces/modal.button';
import { CommonModule } from '@angular/common';
import { Callback } from '../../interfaces/callback';
import { UtilsService } from '../../core/services/utils/utils.service';

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

  constructor(private elementRef: ElementRef, private utils: UtilsService) {
    this.options  = [];
    this.status = false;
  }

  switchStatus() {
    this.status = !this.status;
  }

  execute(calback: Callback) {
    this.utils.executeCallback(calback);
    this.status = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.status = false
    }
  }

}
