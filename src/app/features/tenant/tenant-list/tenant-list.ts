import { Component, computed, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { SearchResponse } from '../../../core/models/wrappers/search-response';
import { Tenant } from '../../../core/models/masterdata/tenant';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TenantService } from '../../../core/services/masterdata/tenant-service';
import { SearchParams } from '../../../core/models/filters/search-params';
import { Datatable } from '../../../shared/datatable/datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from '../../../shared/datatable/datatable.model';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { SearchBar } from '../../../shared/search-bar/search-bar';
import { StatusBadge } from '../../../shared/status-badge/status-badge';

@Component({
  imports: [ReactiveFormsModule, Datatable, RouterLink, SearchBar, StatusBadge],
  selector: 'app-tenant-list',
  styleUrl: './tenant-list.scss',
  templateUrl: './tenant-list.html',
})
export class TenantList implements OnInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #tenantService = inject(TenantService);
  readonly #localStorage = inject(LocalStorageService);

  searchFilterForm = this.#fb.group({
    searchTenant: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  tenant = signal<SearchResponse<Tenant>>(new SearchResponse<Tenant>());
  // showFilter = false;

  tenantSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // PropertiRows
  kodeRow = viewChild.required<TemplateRef<any>>('kodeRow');
  statusRow = viewChild.required<TemplateRef<any>>('statusRow');

  columnTable = computed(() =>[
    {
      name: "Kode",
      // prop is referring to the properties fetched from the API response
      prop: "kode",
      sortBy: "kode",
      flexGrow: 1,
      cellTemplate: this.kodeRow(),
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: false,
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
      name: "Deskripsi",
      prop: "deskripsi",
      sortBy: "deskripsi",
      flexGrow: 3,
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
    // this.tenant = new SearchResponse<Tenant>();

    this.tenantSearchParams.sortBy = 'nama';

    const jsonSearch = this.#localStorage.getItem('tenantSearchParams');

    if (jsonSearch != undefined && jsonSearch != null) {
      this.tenantSearchParams = JSON.parse(jsonSearch) as SearchParams;
      if(this.tenantSearchParams.recordStatus === 'ActiveInActive'){
        this.searchFilterForm.get('showInActive')?.setValue(true)
      }
    }

    // fix double load. code from ngAfterViewInit().
    this.searchFilterForm.get('searchTenant')?.setValue(this.tenantSearchParams.search);
  }

  ngAfterViewInit() {
    this.getTenants();

    this.fC['searchTenant'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
      this.tenantSearchParams.pageIndex = 0;
      this.tenantSearchParams.search = this.fC['searchTenant'].value || '';
      this.getTenants();
    });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.tenantSearchParams.pageIndex = 0;
  //     this.tenantSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.tenantSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getUsers();

  //   });
  }

  clearSearch(input: HTMLInputElement) {
    this.searchFilterForm.controls.searchTenant.reset(); // back to '' (non-nullable)
    input.focus();
  }

  getTenants() {
    const jsonSearch = JSON.stringify(this.tenantSearchParams);
    this.#localStorage.setItem('tenantSearchParams', jsonSearch);

    this.#tenantService.getTenants(this.tenantSearchParams)
      .subscribe((result) => {
        if (result.succeeded) {
          console.log(result.data)
          this.tenant.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.tenantSearchParams.pageSize = val;
    this.getTenants()
  }

  onPaginationChange(val){
    this.tenantSearchParams.pageIndex = val;
    this.getTenants();
  }

  onSortColumn({prop, dir}){
    this.tenantSearchParams.pageIndex = 0;
    this.tenantSearchParams.sortBy = prop;
    this.tenantSearchParams.sortDir = dir;
    this.getTenants();
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
