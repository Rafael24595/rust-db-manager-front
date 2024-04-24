import { Component, OnInit } from '@angular/core';
import { RustDbManagerService } from '../../../../core/services/rust.db.manager.service';
import { Observable } from 'rxjs';
import { Paginable } from '../../../../interfaces/paginable';
import { ServiceLite } from '../../../../interfaces/service.lite';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {

  public services$!: Observable<Paginable<ServiceLite>>;

  constructor(private service: RustDbManagerService) {}

  ngOnInit(): void {
    this.services$ = this.service.findServices();
  }

}
