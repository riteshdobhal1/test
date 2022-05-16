export interface LicensesData {
    workbenchLicensedUsed: number;
    maxUsers: number;
    maxViewerLicenses: number;
    maxWBLicenses: number;
    maxCreatorLicenses: number;
    totalUsers: number;
    viewerLicensesUser: number;
    creatorLicensesUsed: number;
    adminUsers: number;
}

export interface User {
    name: string,
    selected: boolean;
    email: string;
    first_name: string;
    last_name: string;
    wb_user_name: string;
    report_usage: boolean;
    org: string;
    role: string;
    end_customer: string;
    mps_def: string;
    realm_def: string;
    dashboard_admin: boolean;
    user_state: string;
    token_id: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    department: string;
    created_on: string;
    modified_on: string;
    last_login: string;
    is_external: boolean;
    roleName: string;
    adminUser: boolean;
    status: string,
    userType: string,
    countryCode: any
}

export interface RoleProdList {
    name: string;
    disName: string;
    featureData: Array<object>;
    roleType: string;
}

export interface TableauUser {
    roleType: string;
    userName: string;
    mps: string;
}

