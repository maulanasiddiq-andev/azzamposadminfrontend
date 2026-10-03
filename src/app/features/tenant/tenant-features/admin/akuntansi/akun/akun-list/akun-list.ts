import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { SearchBar } from '../../../../../../../shared/search-bar/search-bar';
import { Datatable } from '../../../../../../../shared/datatable/datatable';
import { StatusBadge } from '../../../../../../../shared/status-badge/status-badge';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NonNullableFormBuilder } from '@angular/forms';
import { AkunService } from '../../../../../../../core/services/akuntansi/akun-service';
import { LocalStorageService } from '../../../../../../../core/services/local-storage-service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Akun } from '../../../../../../../core/models/akuntansi/akun';
import { SearchResponse } from '../../../../../../../core/models/wrappers/search-response';
import { SearchParams } from '../../../../../../../core/models/filters/search-params';
import { Page } from '../../../../../../../shared/datatable/datatable.model';
import { debounceTime } from 'rxjs';

@Component({
  imports: [SearchBar, Datatable, StatusBadge, RouterLink],
  selector: 'app-akun-list',
  styleUrl: './akun-list.scss',
  templateUrl: './akun-list.html',
})
export class AkunList {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #akunService = inject(AkunService);
  readonly #localStorage = inject(LocalStorageService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  tenantId = this.route.snapshot.paramMap.get('id');

  searchFilterForm = this.#fb.group({
    searchAkun: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  akun = signal<SearchResponse<Akun>>(new SearchResponse<Akun>());
  // showFilter = false;

  akunSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // PropertiRows
  kodeRow = viewChild.required<TemplateRef<any>>('kodeRow');
  statusRow = viewChild.required<TemplateRef<any>>('statusRow');
  childOfRow = viewChild.required<TemplateRef<any>>('childOfRow');

  columnTable = computed(() => [
    {
      name: "Nomor Akun",
      // prop is referring to the properties fetched from the API response
      prop: "nomorAkun",
      sortBy: "nomorakun",
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
      name: "Jenis Akun",
      prop: "jenisAkun.nama",
      sortBy: "nama",
      flexGrow: 1,
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
      name: "Sub Akun dari",
      prop: "childOf.nama",
      sortBy: "nama",
      flexGrow: 1,
      searchable: true,
      orderable: false,
      resizeable: false,
      sortable: false,
      canAutoResize: true,
      cellTemplate: this.childOfRow(),
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
    // this.akun = new SearchResponse<Akun>();

    this.akunSearchParams.sortBy = 'nama';

    const jsonSearch = this.#localStorage.getItem('akunSearchParams');

    if (jsonSearch != undefined && jsonSearch != null) {
      this.akunSearchParams = JSON.parse(jsonSearch) as SearchParams;
      if(this.akunSearchParams.recordStatus === 'ActiveInActive'){
        this.searchFilterForm.get('showInActive')?.setValue(true)
      }
    }

    // fix double load. code from ngAfterViewInit().
    this.searchFilterForm.get('searchAkun')?.setValue(this.akunSearchParams.search);
  }

  ngAfterViewInit() {
    this.getAkuns();

    this.fC['searchAkun'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
      this.akunSearchParams.pageIndex = 0;
      this.akunSearchParams.search = this.fC['searchAkun'].value || '';
      this.getAkuns();
    });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.akunSearchParams.pageIndex = 0;
  //     this.akunSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.akunSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getAkuns();

  //   });
  }

  clearSearch(input: HTMLInputElement) {
    this.searchFilterForm.controls.searchAkun.reset(); // back to '' (non-nullable)
    input.focus();
  }

  getAkuns() {
    const jsonSearch = JSON.stringify(this.akunSearchParams);
    this.#localStorage.setItem('akunSearchParams', jsonSearch);

    this.#akunService.getAkuns(this.akunSearchParams, this.tenantId || '')
      .subscribe((result) => {
        if (result.succeeded) {
          this.akun.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.akunSearchParams.pageSize = val;
    this.getAkuns()
  }

  onPaginationChange(val){
    this.akunSearchParams.pageIndex = val;
    this.getAkuns();
  }

  onSortColumn({prop, dir}){
    this.akunSearchParams.pageIndex = 0;
    this.akunSearchParams.sortBy = prop;
    this.akunSearchParams.sortDir = dir;
    this.getAkuns();
  }

  // // ACTION POPOVER
  // openEditPage(akunId: string){
  //   this.router.navigateByUrl(`admin/identity/akun/edit/${akunId}`)
  // }

  // openEditRolePage(akunId: string) {
  //   this.router.navigateByUrl(`admin/identity/akun/edit-role/${akunId}`);
  // }

  // openConfirmationDeleteDialog(id){
  //   const item = this.akun.items.find(item => item.akunId === id);
  //   const contentToDelete = [
  //     {
  //         Name: item.akunname,
  //         Value: item.nama
  //     }];

  //   const dialogRef = this.ngbDialog.open(V2DeleteDialogComponent, {
  //       size: 'md',
  //       centered: true,
  //   });

  //   dialogRef.componentInstance.data = {
  //     title: 'Hapus Akun',
  //     question: 'Yakin ingin menghapus data ini?',
  //     content: contentToDelete,
  //     ok: true,
  //     btnOn: 'Hapus',
  //     btnOff: 'Kembali'
  //   }

  //   dialogRef.closed.subscribe((result) => {
  //       if (result === true) {
  //           this.deleteAkun(id);
  //       }
  //   });
  // }

  // deleteAkun(id){
  //   this.akunService.deleteAkun(id).subscribe(response => {
  //     if (response.succeeded) {
  //       this.getAkuns();
  //       this.toastr.success(response.messages[0]);
  //     } else {
  //       this.toastr.error(response.messages[0]);
  //     }
  //   })
  // }

  get fC() { return this.searchFilterForm.controls; }

  // openDetail(akunId: string): void {
  //   this.router.navigateByUrl('admin/identity/akun/detail/' + akunId);
  // }
}
