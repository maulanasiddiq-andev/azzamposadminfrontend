export class Page {
  count: number;
  pageSize: number;
  limit: number;
  offset: number;

  constructor(count = 0, pageSize = 10, limit = 10, offset = 0) {
    this.count = count;
    this.pageSize = pageSize;
    this.limit = limit;
    this.offset = offset;
  }
}

export class ColumnTable {
  name: string;
  prop: string;
  sortBy: string;
  flexGrow: number = 1;
  cellTemplate: any = null;
  resizeable: boolean = false;
  sortable: boolean = false;
  canAutoResize: boolean = true;
  headerClass: string = "";
  hasPermission: boolean = false;
  roleModulName: any;

  constructor(
    name: string,
    prop: string,
    sortBy: string,
    flexGrow = 1,
    cellTemplate = null,
    sortable = true,
    resizeable = false,
    canAutoResize = true,
    headerClass = "", 
    hasPermission = false,
    roleModulName = null,
  ) {
    this.name = name;
    this.prop = prop;
    this.sortBy = sortBy;
    this.flexGrow = flexGrow;
    this.cellTemplate = cellTemplate;
    this.resizeable = resizeable;
    this.sortable = sortable;
    this.canAutoResize = canAutoResize;
    this.headerClass = headerClass;
    this.hasPermission = hasPermission;
    this.roleModulName = roleModulName;
  }
}

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

export enum Direction {
  asc = "asc",
  desc = "desc",
}

export enum SortType {
  single = "single",
  multi = "multi",
}

export class Sorts {
  prop: string;
  dir: Direction;
}

interface PayloadTable {
  recordStatus: string;
  search: string;
  sortBy: string;
  sortDir: Direction;
  pageIndex: number;
  pageSize: number;
  isCount: boolean;
  isValueDisplay: boolean;
}

export class Tables implements PayloadTable {
  recordStatus: string;
  search: string;
  sortBy: string;
  sortDir: Direction;
  pageIndex: number;
  pageSize: number;
  isCount: boolean;
  isValueDisplay: boolean;
}