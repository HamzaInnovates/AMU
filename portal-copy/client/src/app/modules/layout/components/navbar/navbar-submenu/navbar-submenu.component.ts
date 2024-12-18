import { Component, Input, OnInit } from '@angular/core';
import { SubMenuItem } from 'src/app/core/models/menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
    selector: 'div[navbar-submenu]',
    templateUrl: './navbar-submenu.component.html',
    styleUrls: ['./navbar-submenu.component.scss'],
    standalone: true,
    imports: [
        NgFor,
        NgTemplateOutlet,
        RouterLinkActive,
        RouterLink,
        NgIf,
        AngularSvgIconModule,
    ],
})
export class NavbarSubmenuComponent implements OnInit {
  @Input() public submenu = <SubMenuItem[]>{};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.submenu = this.submenu.filter(item => item.access === this.authService.getUserRole());
  }
}
