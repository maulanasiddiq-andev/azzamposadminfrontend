import {
  Component,
  ElementRef,
  Renderer2,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  NgxDatatableModule,
  DatatableComponent as NgxDatatable,
  DatatablePagerComponent,
} from "@swimlane/ngx-datatable";
import { Direction, Page, SortType, Sorts } from "./datatable.model";
import { EventService } from "../../core/services/topbar/event-service";
import { LayoutEventType } from "../../core/enums/events";
// import { EventService } from "src/app/core/services/topbar/event.service";
// import { LayoutEventType } from "src/app/core/enums/events";
// import { RoleModulName } from "src/app/core/enums/role-modul-name.enum";

@Component({
  selector: "app-datatable",
  templateUrl: "./datatable.html",
  styleUrls: ["./datatable.scss"],
  // standalone is the default now; everything the template uses must be listed here
  imports: [
    DatatablePagerComponent,
    NgxDatatableModule,
    NgClass,
    NgTemplateOutlet,
    FormsModule, // [(ngModel)] on the row checkbox
    // + your HasPermission / HasPermissionExcept directives (appHasPermission, appHasPermissionExcept)
  ],
  // OnPush is the default in v22, so no changeDetection needed.
  // Host listeners are cleaned up automatically (the old addEventListener calls leaked).
  host: {
    "(window:resize)": "onWindowResize()",
    "(window:scroll)": "datatablePosition()",
  },
})
export class Datatable {
  private readonly responsive = inject(BreakpointObserver);
  private readonly renderer = inject(Renderer2);
  private readonly eventService = inject(EventService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  // ---- view queries
  readonly tableData = viewChild<NgxDatatable>("tableData");
  readonly stickyTable = viewChild<NgxDatatable>("stickyTable");

  // ---- inputs
  readonly rows = input<any[]>([]);
  readonly columns = input<any[]>([]);
  readonly paginationData = input(new Page(0));
  readonly columnMode = input<any>();
  readonly scrollBarH = input(false);
  readonly scrollBarV = input(false);
  readonly selectionType = input<any>();
  readonly sortType = input(SortType.single);
  readonly isShowHeader = input(true);
  readonly isCheckboxMode = input(false);
  readonly additionalEntries = input(false);
  readonly groupRowsBy = input<string>();
  readonly isNewLayout = input(false);
  readonly isChatLayout = input(false);

  // ---- outputs
  readonly entriesChange = output<number>();
  readonly searchChange = output<any>();
  readonly navPositionChange = output<number>();
  readonly setPage = output<any>();
  readonly sort = output<any>();
  readonly checkboxChange = output<any>();
  readonly headerCheckboxChange = output<boolean>();

  // ---- state
  // readonly roleModulName = RoleModulName;
  readonly minWidthColumn = 110;
  readonly minWidthColumnMobile = 140;

  // follows paginationData().pageSize, but can be overwritten by the entries dropdown
  readonly entries = linkedSignal(() => this.paginationData().pageSize);

  // sorting state (read by the template)
  readonly sortBy = signal<string | undefined>(undefined);
  readonly sortDir = signal<"asc" | "desc" | undefined>(undefined);

  readonly pageSizes = computed(() =>
    this.additionalEntries() ? [10, 25, 50, 100, 500, 1000] : [10, 25, 50, 100]
  );

  readonly isMobile = signal(false);
  readonly autoHideSideMenu = signal(false);
  readonly widthColumn = signal(this.minWidthColumn);
  readonly displayColumns = signal<any[]>([]);
  readonly hiddenColumns = signal<any[]>([]);
  readonly isSticky = signal(false);
  readonly allRowsSelected = signal(false);

  // derived from the columns input (replaces the mapping that lived in ngOnChanges)
  readonly normalizedColumns = computed(() =>
    (this.columns() ?? []).map((item) => ({
      ...item,
      resizeable: false,
      sortable: item.sortable || false,
    }))
  );

  // plain fields (bound via [(...)] or only used internally)
  expanded: any = {};
  selected: any[] = [];
  sorts: Sorts[] = [];
  private prevPage = 1;

  constructor() {
    this.responsive
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (result.matches) {
          const mobile = this.responsive.isMatched([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
          ]);
          this.isMobile.set(mobile);
          this.autoHideSideMenu.set(mobile);
          this.recalculate();
        }
        this.setWidthTable();
        this.adjustTable();
      });

    // NOTE: check whether EventService.subscribe returns a Subscription/unsubscribe fn
    // and tear it down with inject(DestroyRef).onDestroy(...) if it does.
    this.eventService.subscribe(
      LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE,
      () => setTimeout(() => this.recalculate(), 100)
    );

    // replaces ngOnChanges: re-run whenever rows/columns change
    effect(() => {
      this.rows();
      const cols = this.normalizedColumns();
      untracked(() => {
        this.displayColumns.set(cols);
        this.recalculate();
        this.setWidthTable();
        this.adjustTable();
      });
    });

    // replaces ngOnInit/ngAfterViewInit: the table element only exists after first render
    afterNextRender(() => {
      this.setWidthTable();
      this.adjustTable();
    });
  }

  // ngAfterViewInit() {
  //   console.log(this.rows)
  // }

  private recalculate() {
    this.tableData()?.recalculate();
    this.stickyTable()?.recalculate();
  }

  onWindowResize() {
    this.setWidthTable();
    this.adjustTable();
  }

  adjustTable() {
    const table = this.tableData();
    const columns = this.normalizedColumns();
    const columnWidth = this.widthColumn();

    if (!columnWidth || !table?.element || !columns.length) return;

    const visibleCount = Math.floor(table.element.clientWidth / columnWidth);
    this.displayColumns.set(columns.slice(0, visibleCount));
    this.hiddenColumns.set(columns.slice(visibleCount));

    setTimeout(() => {
      this.recalculate();

      const hasHidden = this.hiddenColumns().length > 0;
      if (hasHidden) table.rowDetail?.expandAllRows();

      // Consider replacing this with a CSS class toggled from hiddenColumns().length
      this.host.nativeElement
        .querySelectorAll<HTMLElement>(".datatable-row-odd")
        .forEach((el) => (el.style.backgroundColor = hasHidden ? "#EFF2F5" : ""));
    }, 100);
  }

  setWidthTable() {
    const minWidth = this.isMobile()
      ? this.minWidthColumnMobile
      : this.minWidthColumn;
    const count = this.columns().length;

    if (count > 0) {
      const tableWidth = this.tableData()?.element?.clientWidth ?? 0;
      this.widthColumn.set(Math.max(tableWidth / count, minWidth));
    } else {
      this.widthColumn.set(minWidth);
    }
  }

  datatablePosition() {
    const el = this.host.nativeElement;
    const wrapper = el.querySelector(".dataTables_wrapper");
    const header = el.querySelector(".datatable-header-inner");
    if (!wrapper || !header) return;

    this.stickyTable()
      ?.element.querySelector<HTMLElement>(".empty-row")
      ?.style.setProperty("display", "none");

    const headerBottom = wrapper.getBoundingClientRect().top + header.clientHeight;
    // border where the header is hidden while scrolling
    const maxBorder = this.isNewLayout() ? 110 : 124;
    this.isSticky.set(headerBottom < maxBorder);
  }

  // ---- event handlers
  onSetPage(ev: any) {
    this.setPage.emit(ev);
    this.onNavigationChange({ page: ev.offset + 1 });
  }

  onSearchList(ev: any) {
    this.searchChange.emit(ev);
  }

  onEntriesChange(ev: Event) {
    this.entries.set(Number((ev.target as HTMLSelectElement).value));
    this.entriesChange.emit(this.entries());
    this.navPositionChange.emit(0);
  }

  onNavigationChange(ev: { page: number }) {
    if (isNaN(ev?.page)) return;

    const page = Number(ev.page);
    this.navPositionChange.emit(page - 1);
    if (page > this.prevPage) window.scrollTo(0, 0); // scroll on next page
    this.prevPage = page;
  }

  onSort(ev: { sorts: Sorts[] }) {
    if (Array.isArray(ev?.sorts)) {
      this.sorts = ev.sorts;
      this.sort.emit(this.sorts[0]); // single sort
    }
    this.setSortIcon();
  }

  setSortIcon() {
    setTimeout(() => {
      const root = this.host.nativeElement;
      const hasAsc = root.getElementsByClassName("sort-asc").length > 0;
      const hasDesc = root.getElementsByClassName("sort-desc").length > 0;

      Array.from(root.getElementsByClassName("sort-btn")).forEach((btn) => {
        if (hasAsc) this.renderer.addClass(btn, "ri-arrow-up-s-fill");
        if (hasDesc) this.renderer.addClass(btn, "ri-arrow-down-s-fill");
      });
    }, 500);
  }

  onResize(_ev: any) {
    this.recalculate();
  }

  showValue(row: { [x: string]: { [x: string]: any } }, prop: string) {
    const s = prop?.split(".");
    let val = row[prop];
    if (s?.length == 2) {
      val = row[s[0]][s[1]];
    }
    return val;
  }

  onDetailToggle(_ev: any) {}

  toggleExpandRow(row: any) {
    this.tableData()?.rowDetail?.toggleExpandRow(row);
  }

  removeNode() {
    const table = this.tableData();
    const detailEl = this.host.nativeElement.querySelector(
      ".datatable-row-detail"
    );
    if (detailEl && table?.element) {
      this.renderer.removeChild(table.element, detailEl);
    }
  }

  getTableClass() {
    return {
      sortAscending: "ri-arrow-down-s-fill",
      sortDescending: "ri-arrow-up-s-fill",
    };
  }

  // ---- checkbox
  onActivate(event: any) {
    if (this.isCheckboxMode() && event.type === "click") {
      event.row.selected = !event.row.selected;
      this.onCheckboxChange(event.row);
    }
  }

  onCheckboxChange(row: any) {
    this.checkboxChange.emit(row);
    this.updateHeaderCheckboxState();
  }

  updateHeaderCheckboxState() {
    this.allRowsSelected.set(this.isAllRowsSelected());
  }

  onCheckAllRow(event: any) {
    const isChecked = event.target.checked;
    this.rows().forEach((row) => (row.selected = isChecked));
    this.allRowsSelected.set(isChecked);
    this.headerCheckboxChange.emit(isChecked);
    this.checkboxChange.emit(this.rows());
  }

  isAllRowsSelected() {
    const rows = this.rows();
    return rows.length > 0 && rows.every((row) => row.selected);
  }

  getRowClass = (_row: any) => ({
    "cursor-pointer": this.isCheckboxMode(),
  });

  sorting(column: { sortBy: string }) {
    const sorts = new Sorts();
    sorts.prop = column.sortBy;

    if (this.sortBy() === column.sortBy) {
      const next = this.sortDir() === "asc" ? "desc" : "asc";
      this.sortDir.set(next);
      sorts.dir = next === "asc" ? Direction.asc : Direction.desc;
    } else {
      this.sortBy.set(column.sortBy);
      this.sortDir.set("asc");
      sorts.dir = Direction.asc;
    }

    this.sort.emit(sorts);
    this.setSortIcon();
  }
}