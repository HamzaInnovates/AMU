import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Dashboard',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: '',
          route: '/dashboard',
          children: [
            { label: 'Dashboard', route: '/dashboard/home', access: 'admin' },
            { label: 'Patches', route: '/dashboard/patches', access: 'admin' },
            { label: 'Systems', route: '/dashboard/systems', access: 'admin' },
            { label: 'Deploymnents', route: '/dashboard/deployments', access: 'admin' },
            { label: 'Reports', route: '/dashboard/reports', access: 'admin' },
          ],
        }
      ],
    },  
  ];
}
