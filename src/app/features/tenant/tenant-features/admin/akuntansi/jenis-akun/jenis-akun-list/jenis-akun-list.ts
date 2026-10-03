import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { JenisAkunService } from '../../../../../../../core/services/akuntansi/jenis-akun-service';
import { LocalStorageService } from '../../../../../../../core/services/local-storage-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SearchResponse } from '../../../../../../../core/models/wrappers/search-response';
import { JenisAkun } from '../../../../../../../core/models/akuntansi/jenis-akun';
import { SearchParams } from '../../../../../../../core/models/filters/search-params';
import { Page } from '../../../../../../../shared/datatable/datatable.model';
import { debounceTime } from 'rxjs';
import { SearchBar } from '../../../../../../../shared/search-bar/search-bar';
import { Datatable } from '../../../../../../../shared/datatable/datatable';
import { StatusBadge } from '../../../../../../../shared/status-badge/status-badge';

@Component({
  imports: [SearchBar, Datatable, StatusBadge, RouterLink],
  selector: 'app-jenis-akun-list',
  styleUrl: './jenis-akun-list.scss',
  templateUrl: './jenis-akun-list.html',
})
export class JenisAkunList {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #jenisAkunService = inject(JenisAkunService);
  readonly #localStorage = inject(LocalStorageService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  tenantId = this.route.snapshot.paramMap.get('id');

  searchFilterForm = this.#fb.group({
    searchJenisAkun: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  jenisAkun = signal<SearchResponse<JenisAkun>>(new SearchResponse<JenisAkun>());
  // showFilter = false;

  jenisAkunSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // PropertiRows
  kodeRow = viewChild.required<TemplateRef<any>>('kodeRow');
  statusRow = viewChild.required<TemplateRef<any>>('statusRow');

  columnTable = computed(() => [
    {
      name: "Nama",
      // prop is referring to the properties fetched from the API response
      prop: "nama",
      sortBy: "nama",
      flexGrow: 1,
      cellTemplate: this.kodeRow(),
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
      name: "Kode Awal",
      prop: "kodeAwal",
      sortBy: "kodeawal",
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
    // this.jenisAkun = new SearchResponse<JenisAkun>();

    this.jenisAkunSearchParams.sortBy = 'nama';

    const jsonSearch = this.#localStorage.getItem('jenisAkunSearchParams');

    if (jsonSearch != undefined && jsonSearch != null) {
      this.jenisAkunSearchParams = JSON.parse(jsonSearch) as SearchParams;
      if(this.jenisAkunSearchParams.recordStatus === 'ActiveInActive'){
        this.searchFilterForm.get('showInActive')?.setValue(true)
      }
    }

    // fix double load. code from ngAfterViewInit().
    this.searchFilterForm.get('searchJenisAkun')?.setValue(this.jenisAkunSearchParams.search);
  }

  ngAfterViewInit() {
    this.getJenisAkuns();

    this.fC['searchJenisAkun'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
      this.jenisAkunSearchParams.pageIndex = 0;
      this.jenisAkunSearchParams.search = this.fC['searchJenisAkun'].value || '';
      this.getJenisAkuns();
    });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.jenisAkunSearchParams.pageIndex = 0;
  //     this.jenisAkunSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.jenisAkunSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getJenisAkuns();

  //   });
  }

  clearSearch(input: HTMLInputElement) {
    this.searchFilterForm.controls.searchJenisAkun.reset(); // back to '' (non-nullable)
    input.focus();
  }

  getJenisAkuns() {
    const jsonSearch = JSON.stringify(this.jenisAkunSearchParams);
    this.#localStorage.setItem('jenisAkunSearchParams', jsonSearch);

    this.#jenisAkunService.getJenisAkuns(this.jenisAkunSearchParams, this.tenantId || '')
      .subscribe((result) => {
        if (result.succeeded) {
          this.jenisAkun.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.jenisAkunSearchParams.pageSize = val;
    this.getJenisAkuns()
  }

  onPaginationChange(val){
    this.jenisAkunSearchParams.pageIndex = val;
    this.getJenisAkuns();
  }

  onSortColumn({prop, dir}){
    this.jenisAkunSearchParams.pageIndex = 0;
    this.jenisAkunSearchParams.sortBy = prop;
    this.jenisAkunSearchParams.sortDir = dir;
    this.getJenisAkuns();
  }

  // // ACTION POPOVER
  // openEditPage(jenisAkunId: string){
  //   this.router.navigateByUrl(`admin/identity/jenisAkun/edit/${jenisAkunId}`)
  // }

  // openEditRolePage(jenisAkunId: string) {
  //   this.router.navigateByUrl(`admin/identity/jenisAkun/edit-role/${jenisAkunId}`);
  // }

  // openConfirmationDeleteDialog(id){
  //   const item = this.jenisAkun.items.find(item => item.jenisAkunId === id);
  //   const contentToDelete = [
  //     {
  //         Name: item.jenisAkunname,
  //         Value: item.nama
  //     }];

  //   const dialogRef = this.ngbDialog.open(V2DeleteDialogComponent, {
  //       size: 'md',
  //       centered: true,
  //   });

  //   dialogRef.componentInstance.data = {
  //     title: 'Hapus JenisAkun',
  //     question: 'Yakin ingin menghapus data ini?',
  //     content: contentToDelete,
  //     ok: true,
  //     btnOn: 'Hapus',
  //     btnOff: 'Kembali'
  //   }

  //   dialogRef.closed.subscribe((result) => {
  //       if (result === true) {
  //           this.deleteJenisAkun(id);
  //       }
  //   });
  // }

  // deleteJenisAkun(id){
  //   this.jenisAkunService.deleteJenisAkun(id).subscribe(response => {
  //     if (response.succeeded) {
  //       this.getJenisAkuns();
  //       this.toastr.success(response.messages[0]);
  //     } else {
  //       this.toastr.error(response.messages[0]);
  //     }
  //   })
  // }

  get fC() { return this.searchFilterForm.controls; }

  // openDetail(jenisAkunId: string): void {
  //   this.router.navigateByUrl('admin/identity/jenisAkun/detail/' + jenisAkunId);
  // }
}
