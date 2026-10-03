import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SearchResponse } from '../../../../../../../core/models/wrappers/search-response';
import { Role } from '../../../../../../../core/models/identity/role';
import { RoleService } from '../../../../../../../core/services/identity/role-service';
import { SearchParams } from '../../../../../../../core/models/filters/search-params';
import { Page } from '../../../../../../../shared/datatable/datatable.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Datatable } from '../../../../../../../shared/datatable/datatable';

@Component({
  imports: [Datatable, RouterLink],
  selector: 'app-role-list',
  styleUrl: './role-list.scss',
  templateUrl: './role-list.html',
})
export class RoleList {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #roleService = inject(RoleService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  tenantId = this.route.snapshot.paramMap.get('id');

  readonly searchFilterForm = this.#fb.group({
    searchUser: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  // columnTable: any[] = [];
  role = signal<SearchResponse<Role>>(new SearchResponse<Role>());
  // showFilter = false;

  roleSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // //PropertiRows
  nameRow = viewChild.required<TemplateRef<any>>('nameRow');

  columnTable = computed(() =>[
    {
      name: "Nama",
      // prop is referring to the properties fetched from the API response
      prop: "name",
      sortBy: "nama",
      flexGrow: 2,
      cellTemplate: this.nameRow(),
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    }
  ])

  ngOnInit(): void {
    // this.role = new SearchResponse<Role>();

    // this.searchFilterForm = this.formBuilder.group({
    //   searchUser: '',
    //   showInActive: false
    // });

    // this.roleSearchParams.sortBy = 'username';

    // const jsonSearch = this.localStorage.getItem('roleSearchParams');

    // if (jsonSearch != undefined && jsonSearch != null) {
    //   this.roleSearchParams = JSON.parse(jsonSearch) as roleSearchParams;
    //   if(this.roleSearchParams.recordStatus === 'ActiveInActive'){
    //     this.searchFilterForm.get('showInActive').setValue(true)
    //   }
    // }

    // // fix double load. code from ngAfterViewInit().
    // this.searchFilterForm.get('searchUser').setValue(this.roleSearchParams.search);
  }

  ngAfterViewInit() {
    this.getRoles();

  //   this.fC['searchUser'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.roleSearchParams.pageIndex = 0;
  //     this.roleSearchParams.search = this.fC['searchUser'].value || '';
  //     this.getUsers();
  //   });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.roleSearchParams.pageIndex = 0;
  //     this.roleSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.roleSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getUsers();

  //   });
  }

  getRoles() {
    // const jsonSearch = JSON.stringify(this.roleSearchParams);
    // this.localStorage.setItem('roleSearchParams', jsonSearch);

    this.#roleService.getRoles(this.roleSearchParams, this.tenantId || '')
      .subscribe((result) => {
        console.log(result.data)
        if (result.succeeded) {
          // this.role = result.data;
          this.role.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.roleSearchParams.pageSize = val;
    this.getRoles()
  }

  onPaginationChange(val){
    console.log(val)
    this.roleSearchParams.pageIndex = val;
    this.getRoles();
  }

  onSortColumn({prop, dir}){
    this.roleSearchParams.pageIndex = 0;
    this.roleSearchParams.sortBy = prop;
    this.roleSearchParams.sortDir = dir;
    this.getRoles();
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

  // get fC() { return this.searchFilterForm.controls; }

  // openDetail(userId: string): void {
  //   this.router.navigateByUrl('admin/identity/user/detail/' + userId);
  // }
}
