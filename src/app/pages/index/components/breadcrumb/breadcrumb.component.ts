import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../interfaces/breadcrum';
import { ActivationStart, Route, Router, RouterModule } from '@angular/router';
import { Optional } from '../../../../types/optional';

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

        const oParts = snapshot.routeConfig?.path?.split("/");
        const parts = oParts ? oParts : [];
        
        const iterator = parts.entries();
        let cursor = iterator.next();
        while(!cursor.done) {
          const part = cursor.value[1];
          cursor = iterator.next();

          let title = part.charAt(0).toUpperCase() + part.slice(1);
          let route = part;
          if(part.startsWith(":")) {
            const value = snapshot.paramMap.get(part.slice(1));
            title = value ? value : title;
            route = value ? value : route;
          }
  
          path.push(route);
  
          const matches = routes.find(r => r.path ? this.matchStrings(path.join("/"), r.path) : false);

          const queryKeys = snapshot.queryParamMap.keys;
          if(cursor.done && queryKeys.length) {
            path.push(`?${queryKeys.map(k => `${k}=${snapshot.queryParamMap.get(k)}`).join("&")}`);
          }

          const hide = this.isHidden(matches);
          if(matches && hide) {
            this.breadcrumbs.push({
              title: this.parseTitle(title, matches),
              path: [...path]
            });
          }
        }
      }
    });
  }

  private isHidden(matches: Optional<Route>): boolean {
    return !matches?.data || (matches?.data && !matches.data["hide"]);
  }

  private parseTitle(title: string, matches: Route): string {
    const parsers: ((title: string) => string)[] | undefined = matches.data ? matches.data["parsers"] : undefined;
    if(parsers) {
      for (const parser of parsers) {
        title = parser(title);
      }
    }
    return title;
  }

  private matchStrings(str1: string, str2:string): boolean {
    const regexStr2 = str2.replace(/\//g, "\\/").replace(/:\w+/g, '[^\\/]+');
    const regex = new RegExp(`^${regexStr2}$`);
    return regex.test(str1);
  }

}