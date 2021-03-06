import {
  Component,
  OnInit
} from '@angular/core';

import {
  ManagerService
} from './manager.service';

import {
  Message,
  MenuItem
} from 'primeng/components/common/api';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  providers: [
    ManagerService
  ]
})

export class ManagerComponent implements OnInit {

  // Classes
  manager: Manager = new NewManager();
  user: Search = new SearchUsers();
  branch: Search = new SearchUsers();
  pag: Paginate = new NewPaginate();

  // PrimeNG
  items: any[];
  msgs: Message[];
  tieredItems: MenuItem[];

  dialog: boolean;
  resCRUD: any;

  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.getManagers(this.pag.curr);
    // ContextMenu
    this.tieredItems = [{
      label: 'Удалить',
      icon: 'fa ui-icon-delete-forever',
      command: (event) => this.deleteManager(this.manager.id, this.manager.fio)
    }, {
      label: 'Редактировать',
      icon: 'fa ui-icon-edit',
      command: (event) => this.showDialog()
    }];
  }

  getManagers(paget: number) {
    this.managerService
      .getManagers(this.pag.curr)
      .subscribe(
        data => {
          this.items = data[0].json.data;
          this.pag.count = data[0].json['page-count'];
        },
        err => console.error(err),
        // () => {
        //   console.log('GET Managers!');
        // }
      );
  }

  onRowSelect(event: any) {
    this.manager.id = event.data.id;
    this.manager.fio = event.data.fio;
  }

  onRowUnselect($event) {
    this.manager = new NewManager();
  }

  showDialog() {
    this.dialog = true;
  }

  searchUser(event: any) {
    this.managerService
      .searchUser(event.query)
      .subscribe(
        data => {
          this.user.result = data[0].json.data;
        },
        err => console.error(err),
        // () => {
        //   console.log(this.user.result);
        // }
      );
  }

  searchBranch(event: any) {
    this.managerService
      .searchBranch(event.query)
      .subscribe(
        data => {
          this.branch.result = data[0].json.data;
        },
        err => console.error(err),
        // () => {
        //   console.log(this.branch.result);
        // }
      );
  }

  createManager(userId: number, branchId: number, binotelId: number) {
    this.managerService
      .createManager(this.user.id, this.branch.id, this.manager.binotelId)
      .subscribe(
        data => {
          this.resCRUD = data[0].json;
        },
        err => console.error(err),
        () => {
          this.msgs = [];
          if (this.resCRUD.errors.length < 1 && this.user.result) {
            this.getManagers(this.pag.curr);
            this.dialog = false;
            this.msgs.push({
              severity: 'info',
              summary: 'Менеджер добавлен',
              detail: this.user.result[0].second_name +
                ' ' + this.user.result[0].first_name + ' ' + this.user.result[0].patronymic
            });
            this.user = new SearchUsers();
            this.branch = new SearchUsers();
            this.manager = new NewManager();
          }
          for (let i = 0; i < this.resCRUD.errors.length; i++) {
            this.msgs.push({
              severity: 'error',
              summary: 'Ошибка',
              detail: this.resCRUD.errors[i]
            });
          }
        }
      );
  }

  updateManager(id: number, userId: number, branchId: number, binotelId: number) {
    this.managerService
      .updateManager(this.manager.id, this.user.id, this.branch.id, this.manager.binotelId)
      .subscribe(
        data => {
          this.resCRUD = data[0].json;
        },
        err => console.error(err),
        () => {
          this.msgs = [];
          if (this.resCRUD.errors.length < 1) {
            this.getManagers(this.pag.curr);
            this.dialog = false;
            this.msgs.push({
              severity: 'info',
              summary: 'Менеджер обновлён',
              detail: this.user.result[0].second_name +
                ' ' + this.user.result[0].first_name + ' ' + this.user.result[0].patronymic
            });
            this.user = new SearchUsers();
            this.branch = new SearchUsers();
            this.manager = new NewManager();
          }
          for (let i = 0; i < this.resCRUD.errors.length; i++) {
            this.msgs.push({
              severity: 'error',
              summary: 'Ошибка',
              detail: this.resCRUD.errors[i]
            });
          }
        }
      );
  }

  deleteManager(id: number, name: string) {
    this.managerService
      .deleteManager(this.manager.id)
      .subscribe(
        data => {
          this.resCRUD = data[0].json;
        },
        err => console.error(err),
        () => {
          this.getManagers(this.pag.curr);
          this.msgs = [];
          this.msgs.push({
            severity: 'info',
            summary: 'Менеджер удалён',
            detail: this.manager.fio
          });
        }
      );
  }

}

export interface Manager {
  id ?: number;
  binotelId ?: number;
  fio ?: string;
  branch ?: string;
}

class NewManager implements Manager {
  constructor(public id ?: number, public binotelId ?: number, public fio ?: string, public branch ?: string) {}
}

export interface Paginate {
  count ?: string[];
  curr: number;
}

class NewPaginate implements Paginate {
  constructor(public count ?: string[], public curr = 1) {}
}

export interface Search {
  id ?: number;
  complete ?: string;
  result ?: any[];
}

class SearchUsers implements Search {
  constructor(public id ?: number, public complete ?: string, public result ?: string[]) {}
}
