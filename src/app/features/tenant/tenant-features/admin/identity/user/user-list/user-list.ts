import { Component, computed, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { UserService } from '../../../../../../../core/services/identity/user-service';
import { LocalStorageService } from '../../../../../../../core/services/local-storage-service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SearchResponse } from '../../../../../../../core/models/wrappers/search-response';
import { User } from '../../../../../../../core/models/identity/user';
import { SearchParams } from '../../../../../../../core/models/filters/search-params';
import { Page } from '../../../../../../../shared/datatable/datatable.model';
import { debounceTime } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchBar } from '../../../../../../../shared/search-bar/search-bar';
import { Datatable } from '../../../../../../../shared/datatable/datatable';
import { StatusBadge } from '../../../../../../../shared/status-badge/status-badge';
import { DatePipe } from '@angular/common';

@Component({
  imports: [SearchBar, Datatable, StatusBadge, RouterLink, DatePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.scss',
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #userService = inject(UserService);
  readonly #localStorage = inject(LocalStorageService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  tenantId = this.route.snapshot.paramMap.get('id');

  searchFilterForm = this.#fb.group({
    searchUser: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  user = signal<SearchResponse<User>>(new SearchResponse<User>());
  // showFilter = false;

  userSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // PropertiRows
  usernameRow = viewChild.required<TemplateRef<any>>('usernameRow');
  statusRow = viewChild.required<TemplateRef<any>>('statusRow');
  lastAccessRow = viewChild.required<TemplateRef<any>>('lastAccessRow');

  columnTable = computed(() =>[
    {
      name: "Username",
      // prop is referring to the properties fetched from the API response
      prop: "username",
      sortBy: "username",
      flexGrow: 1,
      cellTemplate: this.usernameRow(),
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Nama",
      prop: "nama",
      sortBy: "nama",
      flexGrow: 1,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Email",
      prop: "email",
      sortBy: "email",
      flexGrow: 2,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Deskripsi",
      prop: "deskripsi",
      sortBy: "deskripsi",
      flexGrow: 2,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Terakhir Akses",
      prop: "lastAccessDate",
      sortBy: "lastaccessdate",
      cellTemplate: this.lastAccessRow(),
      flexGrow: 1,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Status",
      prop: "recordStatus",
      sortBy: "recordstatus",
      flexGrow: 1,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      cellTemplate: this.statusRow(),
      search: {
          value: "",
          regex: false
      }
    },
  ])

  ngOnInit(): void {
    // this.user = new SearchResponse<User>();

    this.userSearchParams.sortBy = 'nama';

    const jsonSearch = this.#localStorage.getItem('userSearchParams');

    if (jsonSearch != undefined && jsonSearch != null) {
      this.userSearchParams = JSON.parse(jsonSearch) as SearchParams;
      if(this.userSearchParams.recordStatus === 'ActiveInActive'){
        this.searchFilterForm.get('showInActive')?.setValue(true)
      }
    }

    // fix double load. code from ngAfterViewInit().
    this.searchFilterForm.get('searchUser')?.setValue(this.userSearchParams.search);
  }

  ngAfterViewInit() {
    this.getUsers();

    this.fC['searchUser'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
      this.userSearchParams.pageIndex = 0;
      this.userSearchParams.search = this.fC['searchUser'].value || '';
      this.getUsers();
    });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.userSearchParams.pageIndex = 0;
  //     this.userSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.userSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getUsers();

  //   });
  }

  clearSearch(input: HTMLInputElement) {
    this.searchFilterForm.controls.searchUser.reset(); // back to '' (non-nullable)
    input.focus();
  }

  getUsers() {
    const jsonSearch = JSON.stringify(this.userSearchParams);
    this.#localStorage.setItem('userSearchParams', jsonSearch);

    this.#userService.getUsers(this.userSearchParams, this.tenantId || '')
      .subscribe((result) => {
        if (result.succeeded) {
          console.log(result.data)
          this.user.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.userSearchParams.pageSize = val;
    this.getUsers()
  }

  onPaginationChange(val){
    this.userSearchParams.pageIndex = val;
    this.getUsers();
  }

  onSortColumn({prop, dir}){
    this.userSearchParams.pageIndex = 0;
    this.userSearchParams.sortBy = prop;
    this.userSearchParams.sortDir = dir;
    this.getUsers();
  }

  // // ACTION POPOVER
  // openEditPage(userId: string){
  //   this.router.navigateByUrl(`admin/identity/user/edit/${userId}`)
  // }

  // openEditRolePage(userId: string) {
  //   this.router.navigateByUrl(`admin/identity/user/edit-role/${userId}`);
  // }

  // openConfirmationDeleteDialog(id){
  //   const item = this.user.items.find(item => item.userId === id);
  //   const contentToDelete = [
  //     {
  //         Name: item.username,
  //         Value: item.nama
  //     }];

  //   const dialogRef = this.ngbDialog.open(V2DeleteDialogComponent, {
  //       size: 'md',
  //       centered: true,
  //   });

  //   dialogRef.componentInstance.data = {
  //     title: 'Hapus User',
  //     question: 'Yakin ingin menghapus data ini?',
  //     content: contentToDelete,
  //     ok: true,
  //     btnOn: 'Hapus',
  //     btnOff: 'Kembali'
  //   }

  //   dialogRef.closed.subscribe((result) => {
  //       if (result === true) {
  //           this.deleteUser(id);
  //       }
  //   });
  // }

  // deleteUser(id){
  //   this.userService.deleteUser(id).subscribe(response => {
  //     if (response.succeeded) {
  //       this.getUsers();
  //       this.toastr.success(response.messages[0]);
  //     } else {
  //       this.toastr.error(response.messages[0]);
  //     }
  //   })
  // }

  get fC() { return this.searchFilterForm.controls; }

  // openDetail(userId: string): void {
  //   this.router.navigateByUrl('admin/identity/user/detail/' + userId);
  // }
}
