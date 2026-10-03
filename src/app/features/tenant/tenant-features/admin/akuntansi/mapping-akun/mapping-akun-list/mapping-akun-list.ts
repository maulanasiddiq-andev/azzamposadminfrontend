import { AfterViewInit, Component, computed, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { SearchBar } from '../../../../../../../shared/search-bar/search-bar';
import { Datatable } from '../../../../../../../shared/datatable/datatable';
import { StatusBadge } from '../../../../../../../shared/status-badge/status-badge';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NonNullableFormBuilder } from '@angular/forms';
import { MappingAkunService } from '../../../../../../../core/services/akuntansi/mapping-akun-service';
import { LocalStorageService } from '../../../../../../../core/services/local-storage-service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { SearchResponse } from '../../../../../../../core/models/wrappers/search-response';
import { MappingAkun } from '../../../../../../../core/models/akuntansi/mapping-akun';
import { SearchParams } from '../../../../../../../core/models/filters/search-params';
import { Page } from '../../../../../../../shared/datatable/datatable.model';
import { debounceTime } from 'rxjs';

@Component({
  imports: [SearchBar, Datatable, StatusBadge, RouterLink],
  selector: 'app-mapping-akun-list',
  styleUrl: './mapping-akun-list.scss',
  templateUrl: './mapping-akun-list.html',
})
export class MappingAkunList implements OnInit, AfterViewInit {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #mappingAkunService = inject(MappingAkunService);
  readonly #localStorage = inject(LocalStorageService);

  // Tenant ID
  private route = inject(ActivatedRoute);
  tenantId = this.route.snapshot.paramMap.get('id');

  searchFilterForm = this.#fb.group({
    searchMappingAkun: '',
    showInActive: false,
  });
  
  columnModeDatatable = ColumnMode;
  // roleModulName = RoleModulName;
  mappingAkun = signal<SearchResponse<MappingAkun>>(new SearchResponse<MappingAkun>());
  // showFilter = false;

  mappingAkunSearchParams = new SearchParams();
  paginationData = signal(new Page(0));

  // PropertiRows
  kodeRow = viewChild.required<TemplateRef<any>>('kodeRow');
  statusRow = viewChild.required<TemplateRef<any>>('statusRow');

  columnTable = computed(() => [
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
      sortable: true,
      canAutoResize: true,
      search: {
          value: "",
          regex: false
      }
    },
    {
      name: "Mapping Akun",
      prop: "mappingConstant",
      sortBy: "mappingconstanta",
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
      name: "Akun",
      prop: "akun.nama",
      sortBy: "mappingconstanta",
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
    // this.mappingAkun = new SearchResponse<MappingAkun>();

    this.mappingAkunSearchParams.sortBy = 'nama';

    const jsonSearch = this.#localStorage.getItem('mappingAkunSearchParams');

    if (jsonSearch != undefined && jsonSearch != null) {
      this.mappingAkunSearchParams = JSON.parse(jsonSearch) as SearchParams;
      if(this.mappingAkunSearchParams.recordStatus === 'ActiveInActive'){
        this.searchFilterForm.get('showInActive')?.setValue(true)
      }
    }

    // fix double load. code from ngAfterViewInit().
    this.searchFilterForm.get('searchMappingAkun')?.setValue(this.mappingAkunSearchParams.search);
  }

  ngAfterViewInit() {
    this.getMappingAkuns();

    this.fC['searchMappingAkun'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
      this.mappingAkunSearchParams.pageIndex = 0;
      this.mappingAkunSearchParams.search = this.fC['searchMappingAkun'].value || '';
      this.getMappingAkuns();
    });

  //   this.fC['showInActive'].valueChanges.pipe(debounceTime(700)).subscribe((value) => {
  //     this.mappingAkunSearchParams.pageIndex = 0;
  //     this.mappingAkunSearchParams.recordStatus = RecordStatus.Active;

  //     if (value === true) {
  //       this.mappingAkunSearchParams.recordStatus = RecordStatus.ActiveInActive;
  //     }

  //     this.getMappingAkuns();

  //   });
  }

  clearSearch(input: HTMLInputElement) {
    this.searchFilterForm.controls.searchMappingAkun.reset(); // back to '' (non-nullable)
    input.focus();
  }

  getMappingAkuns() {
    const jsonSearch = JSON.stringify(this.mappingAkunSearchParams);
    this.#localStorage.setItem('mappingAkunSearchParams', jsonSearch);

    this.#mappingAkunService.getMappingAkuns(this.mappingAkunSearchParams, this.tenantId || '')
      .subscribe((result) => {
        if (result.succeeded) {
          this.mappingAkun.set(result.data);
          this.paginationData.set(new Page(result.data.totalItem, result.data.pageSize, result.data.pageSize, result.data.currentPage));
        }
      });
  }

  onEntriesChange(val){
    this.mappingAkunSearchParams.pageSize = val;
    this.getMappingAkuns()
  }

  onPaginationChange(val){
    this.mappingAkunSearchParams.pageIndex = val;
    this.getMappingAkuns();
  }

  onSortColumn({prop, dir}){
    this.mappingAkunSearchParams.pageIndex = 0;
    this.mappingAkunSearchParams.sortBy = prop;
    this.mappingAkunSearchParams.sortDir = dir;
    this.getMappingAkuns();
  }

  // // ACTION POPOVER
  // openEditPage(mappingAkunId: string){
  //   this.router.navigateByUrl(`admin/identity/mappingAkun/edit/${mappingAkunId}`)
  // }

  // openEditRolePage(mappingAkunId: string) {
  //   this.router.navigateByUrl(`admin/identity/mappingAkun/edit-role/${mappingAkunId}`);
  // }

  // openConfirmationDeleteDialog(id){
  //   const item = this.mappingAkun.items.find(item => item.mappingAkunId === id);
  //   const contentToDelete = [
  //     {
  //         Name: item.mappingAkunname,
  //         Value: item.nama
  //     }];

  //   const dialogRef = this.ngbDialog.open(V2DeleteDialogComponent, {
  //       size: 'md',
  //       centered: true,
  //   });

  //   dialogRef.componentInstance.data = {
  //     title: 'Hapus MappingAkun',
  //     question: 'Yakin ingin menghapus data ini?',
  //     content: contentToDelete,
  //     ok: true,
  //     btnOn: 'Hapus',
  //     btnOff: 'Kembali'
  //   }

  //   dialogRef.closed.subscribe((result) => {
  //       if (result === true) {
  //           this.deleteMappingAkun(id);
  //       }
  //   });
  // }

  // deleteMappingAkun(id){
  //   this.mappingAkunService.deleteMappingAkun(id).subscribe(response => {
  //     if (response.succeeded) {
  //       this.getMappingAkuns();
  //       this.toastr.success(response.messages[0]);
  //     } else {
  //       this.toastr.error(response.messages[0]);
  //     }
  //   })
  // }

  get fC() { return this.searchFilterForm.controls; }

  // openDetail(mappingAkunId: string): void {
  //   this.router.navigateByUrl('admin/identity/mappingAkun/detail/' + mappingAkunId);
  // }
}
