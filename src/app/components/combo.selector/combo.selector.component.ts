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

  @ViewChild('combo')
  private combo!: ElementRef<HTMLDialogElement>;

  @Input() 
  public options: ModalButton[];

  protected status: boolean;

  public constructor(private elementRef: ElementRef, private utils: UtilsService) {
    this.options  = [];
    this.status = false;
  }

  protected switchStatus() {
    this.status = !this.status;
  }

  protected execute(calback: Callback) {
    this.utils.executeCallback(calback);
    this.status = false;
  }

  @HostListener('document:click', ['$event'])
  protected onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.status = false
    }
  }

}
