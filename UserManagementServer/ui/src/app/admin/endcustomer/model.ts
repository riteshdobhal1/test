

export interface ENDCUSTOMER {
  mfr: string;
  prod: string;
  sch: string;
  endcustomer_name: string;
  serial_number: Array<string>;
  created_by: string;
  updated_on: Date;
  selected: boolean;
  rowIndex: number;
  disabled: boolean;
  group_name: Array<string>;
  product: string;
}

export interface SYSIDLIST {
  sysId : string;
  selected: boolean;
  disabled: boolean;
  rowIndex: number;
  systemName: string;
  hospName: string;
  compName: string;
  city: string;
  country: string;
}