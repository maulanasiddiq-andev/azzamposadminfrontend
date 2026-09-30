import { Component, inject, OnInit } from '@angular/core';
import { SearchResponse } from '../../../core/models/wrappers/search-response';
import { Tenant } from '../../../core/models/masterdata/tenant';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TenantService } from '../../../core/services/masterdata/tenant-service';
import { SearchParams } from '../../../core/models/filters/search-params';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-tenant-list',
  styleUrl: './tenant-list.scss',
  templateUrl: './tenant-list.html',
})
export class TenantList implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #tenantService = inject(TenantService);

  readonly searchFilterForm = this.#fb.group({
    searchUser: '',
    showInActive: false,
  });
  
  // columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  tenant: any;
  // columnTable;
  // showFilter = false;

  tenantSearchParams = new SearchParams();
  // paginationData = new Page(0);

  // //PropertiRows
  // @ViewChild('usernameRow') usernameRow: TemplateRef<any>;
  // @ViewChild('isLockedRow') isLockedRow: TemplateRef<any>;
  // @ViewChild('lastAccessDateRow') lastAccessDateRow: TemplateRef<any>;
  // @ViewChild('userRolesRow') userRolesRow: TemplateRef<any>;
  // @ViewChild('statusRow') statusRow: TemplateRef<any>;
  // @ViewChild('actionRow') actionRow: TemplateRef<any>;
  
  // constructor(
  //   private userService: UserService,
  //   private localStorage: LocalStorageService,
  //   private formBuilder: FormBuilder,
  //   private ngbDialog: NgbModal,
  //   private toastr: ToastrService,
  //   private router: Router
  // ) {
  // }

  ngOnInit(): void {
    this.tenant = new SearchResponse<Tenant>();

    // this.searchFilterForm = this.formBuilder.group({
    //   searchUser: '',
    //   showInActive: false
    // });

    // this.userSearchParams.sortBy = 'username';

    // const jsonSearch = this.localStorage.getItem('userSearchParams');

    // if (jsonSearch != undefined && jsonSearch != null) {
    //   this.userSearchParams = JSON.parse(jsonSearch) as UserSearchParams;
    //   if(this.userSearchParams.recordStatus === 'ActiveInActive'){
    //     this.searchFilterForm.get('showInActive').setValue(true)
    //   }
    // }

    // // fix double load. code from ngAfterViewInit().
    // this.searchFilterForm.get('searchUser').setValue(this.userSearchParams.search);
  }

  ngAfterViewInit() {
    this.getTenants();

  //   this.fC['searchUser'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.userSearchParams.pageIndex = 0;
  //     this.userSearchParams.search = this.fC['searchUser'].value || '';
  //     this.getUsers();
  //   });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.userSearchParams.pageIndex = 0;
  //     this.userSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.userSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getUsers();

  //   });

  //   // Define Coloum Row in Table
  //   this.columnTable = [
  //         {
  //           name: "Username",
  //           prop: "username",
  //           sortBy: "username",
  //           flexGrow: 2,
  //           cellTemplate: this.usernameRow,
  //           searchable: true,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: true,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           }
  //         },
  //         {
  //           name: "Nama",
  //           prop: "nama",
  //           sortBy: "nama",
  //           flexGrow: 2,
  //           searchable: true,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: true,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           }
  //         },
  //         {
  //           name: "Terkunci",
  //           prop: "isLocked",
  //           sortBy: "isLocked",
  //           flexGrow: 1,
  //           cellTemplate: this.isLockedRow,
  //           searchable: true,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: true,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           },
  //           headerClass: "text-center"
  //         },
  //         {
  //           name: "Akses Terakhir",
  //           prop: "lastAccessDate",
  //           sortBy: "lastAccessDate",
  //           flexGrow: 1,
  //           cellTemplate: this.lastAccessDateRow,
  //           roleModulName: [this.roleModulName.LastAccessUser],
  //           hasPermission: true,
  //           searchable: true,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: true,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           }
  //         },
  //         {
  //           name: "Roles",
  //           prop: "userRoles",
  //           flexGrow: 2,
  //           cellTemplate: this.userRolesRow,
  //           searchable: true,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: false,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           }
  //         },
  //         {
  //           name: "Status",
  //           prop: 'recordStatus',
  //           flexGrow: 1,
  //           cellTemplate: this.statusRow,
  //           searchable: false,
  //           orderable: false,
  //           resizeable: false,
  //           sortable: false,
  //           canAutoResize: true,
  //           search: {
  //               value: "",
  //               regex: false
  //           },
  //           headerClass: "text-center"
  //       },
  //       {
  //         name: "Aksi",
  //         prop: 'userId',
  //         flexGrow: 1,
  //         cellTemplate: this.actionRow,
  //         hasPermission: true,
  //         roleModulName: [this.roleModulName.EditUser, this.roleModulName.EditUserRole, this.roleModulName.HapusUser],
  //         searchable: false,
  //         orderable: false,
  //         resizeable: false,
  //         sortable: false,
  //         canAutoResize: true,
  //         search: {
  //             value: "",
  //             regex: false
  //         },
  //         headerClass: "text-center" 
  //       }]
  }

  getTenants() {
    // const jsonSearch = JSON.stringify(this.userSearchParams);
    // this.localStorage.setItem('userSearchParams', jsonSearch);

    this.#tenantService.getTenants(this.tenantSearchParams)
      .subscribe((result) => {
        console.log(result.data)
        if (result.succeeded) {
          this.tenant = result.data;
          // this.paginationData = new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage)
        }
      });
  }

  // onEntriesChange(val){
  //   this.userSearchParams.pageSize = val;
  //   this.getUsers()
  // }

  // onPaginationChange(val){
  //   this.userSearchParams.pageIndex = val;
  //   this.getUsers();
  // }

  // onSortColumn({prop, dir}){
  //   this.userSearchParams.pageIndex = 0;
  //   this.userSearchParams.sortBy = prop;
  //   this.userSearchParams.sortDir = dir;
  //   this.getUsers();
  // }

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

  // get fC() { return this.searchFilterForm.controls; }

  // openDetail(userId: string): void {
  //   this.router.navigateByUrl('admin/identity/user/detail/' + userId);
  // }
}
