import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../interfaces/breadcrum';
import { ActivationStart, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {

  public breadcrumbs: Breadcrumb[];

  constructor(private router: Router) {
    this.breadcrumbs = [];
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        this.breadcrumbs = [];
        
        let path: string[] = [];
        
        const routes = this.router.config;
        const snapshot = event.snapshot;

        const parts = snapshot.routeConfig?.path?.split("/");
        for (const part of parts ? parts : []) {
          let title = part.charAt(0).toUpperCase() + part.slice(1);
          let route = part;
          if(part.startsWith(":")) {
            const value = snapshot.paramMap.get(part.slice(1));
            title = value ? value : title;
            route = value ? value : route;
          }

          path.push(route);

          if(routes.find(r => r.path ? this.matchStrings(path.join("/"), r.path) : false)) {
            this.breadcrumbs.push({
              title: title,
              path: [...path]
            });
          }

        }
      }
    });
  }

  matchStrings(str1: string, str2:string) {
    const regexStr2 = str2.replace(/\//g, "\\/").replace(/:\w+/g, '[^\\/]+');
    const regex = new RegExp(`^${regexStr2}$`);
    return regex.test(str1);
}

}