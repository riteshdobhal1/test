//This Is Data Modal For ROLE List Page
export interface ROLEITEM {
  name: string;
  featureData: Array<FEATUREDATA>;
  selected: boolean;
  prodAssigned: Array<string>;
  featuresAssigned: Array<string>;
  roleType: string;
  DisName: string;
  domains: object;
  features: object;
  mps_isdomain: object;
  mps_uidomain:object;
  realm_uidomain:object;
  realm: [];
  realm_appsversion: object;
  realm_isdomain: object;
  studio_proj_limit: number;
  is_super: boolean;
  colapsed:boolean;
  explorer_date_range: object;
  two_auth_support: Array<string>
  "Product & Features": string;
  "Role Type": string;
}
export interface ROLELISTAPIDATA {
  Status: string;
  Msg: string;
  Data: [];
  TwoAuth: boolean;
}
export interface FEATUREDATA {
  features: string;
  featureKey: string;
  featuresDis: Array<string>;
  mps: [];
  name: string;
  selected: boolean;
  isCreator: boolean;
  isViewer: boolean;
  isExplorerEnabled: boolean;
  explorerDateRange: string;
}
export interface FEATURE {
  name:string;
  value:string;
  checked: boolean;
  disabled: boolean;
  category: string;
}
export interface FORMFEATUREDATA {
  name: string;
  features: string;
  featureKey: string;
  mps: [];
  mpsstring: string;
  selected: boolean;
  featureDisplay: Array<FEATURE>;
  expand: boolean;
  disabled: boolean;
  isExplorerEnabled: boolean;
  explorerDateRange;
}
export interface ROLEGRP {
  name: string;
  value: string;
  alert: string;
}
export interface ROLEFEATURE {
  name: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  category: string;
}
