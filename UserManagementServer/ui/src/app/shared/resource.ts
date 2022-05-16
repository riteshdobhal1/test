import {apiVersion, newapiVersion} from './global';
const loginUser = apiVersion + 'aa/uilogin';
const forgotPassword = apiVersion + 'user/forgot/passwd';
const createPassword = apiVersion + 'user/create/passwd';
const logoutUser = apiVersion + '';
const addUser = newapiVersion + 'admin/customer/user/add/';
const editUser = apiVersion + 'customer/user/modify/';
const deleteUser = apiVersion + 'customer/user/bulk_delete/';
const listUserSso = apiVersion + 'customer/user/listsso/';
const listUser = apiVersion + 'customer/user/listnonsso/';
const addRole = apiVersion + 'admin/usermanagement/role/bulk_update/';
const editRole = apiVersion + '';
const deleteRole = apiVersion + 'admin/usermanagement/role/delete/';
const deleteProd = apiVersion + 'admin/usermanagement/role/product/delete/';
const listRole = apiVersion + 'admin/usermanagement/role/list/';
const addEndCustomer = apiVersion + 'healthcheck/ec/add/'; 
const editEndCustomer = apiVersion + 'healthcheck/ec/update/';
const deleteEndCustomer = newapiVersion + 'healthcheck/ec/delete/';
const listEndCustomer = apiVersion + 'healthcheck/ec/details/';
const userdetails = apiVersion + 'admin/role/user/details/';
const disableUser = apiVersion + 'customer/user/disable/';
const enableUser = apiVersion + 'customer/user/enable/';
const addTableauUser = apiVersion + 'admin/tableau/tableauAddUpdateUsers/';
const deleteTableauUser = apiVersion + 'admin/tableau/tableauDeleteUsers/';
const resetPassword = apiVersion + 'user/reset/passwd/';
const realminfo = apiVersion + 'realm/';
const tableauUserRoleUpdate = apiVersion + 'admin/tableau/tableauAddUpdateUsers/';
const logoutAdmin = apiVersion + 'aa/logout';
const bulkEditUsers = apiVersion + 'customer/user/bulk_update/';
const sysIdList = apiVersion +'bundle/system_info/ec/list/';
const sysIdColList = apiVersion +'bundle/system_cols_info/ec/list/';
const availableSysInfo = apiVersion + 'bundle/available_system_info/ec/list/';
const userTracking = apiVersion + 'user_tracking/';
const resendOtp =  apiVersion + 'aa/resendOTP';
const verifyOTP = apiVersion +  'aa/verifyOTP';
const mpseDetails = apiVersion + 'mpse/config/details/';
const rulesSubscriptionFilter = apiVersion + 'rules/alerts/filters/group/users/notification/';
const checkIfTableauConfigured = apiVersion + 'admin/tableau/configured/';
export {loginUser, logoutUser, addUser, editUser, deleteUser, listUser, addRole, editRole, deleteRole, listRole,
     addEndCustomer, editEndCustomer, deleteEndCustomer, listEndCustomer, userdetails, deleteProd, disableUser, enableUser,
     addTableauUser, deleteTableauUser, resetPassword, realminfo, tableauUserRoleUpdate, logoutAdmin, bulkEditUsers,
     sysIdList, userTracking, forgotPassword, resendOtp, verifyOTP, listUserSso,createPassword, sysIdColList, availableSysInfo, mpseDetails, rulesSubscriptionFilter,
     checkIfTableauConfigured};
