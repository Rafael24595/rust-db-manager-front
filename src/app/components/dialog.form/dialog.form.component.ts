import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalButton } from '../../interfaces/modal.button';

@Component({
  selector: 'app-dialog-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.form.component.html',
  styleUrl: './dialog.form.component.css'
})
export class DialogFormComponent {

  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  @Input() widht: string = "500px";
  @Input() height: string = "300px";
  @Input() title!: string;
  @Input() buttons: ModalButton[] = [
    {title: "Close", callback: {func: this.closeModal.bind(this)}}
  ]

  closeModal() {
    this.dialog.nativeElement.close();
    this.dialog.nativeElement.classList.remove('opened');
  }

  openModal() {
    this.dialog.nativeElement.showModal();
    this.dialog.nativeElement.classList.add('opened');
  }

  ngAfterViewInit() {
    this.dialog.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.nodeName === 'DIALOG') {
        this.closeModal();
      }
    });
  }

}