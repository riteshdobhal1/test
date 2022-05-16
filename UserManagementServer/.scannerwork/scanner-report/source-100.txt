import org.joda.time._

package object constants {
  val CompanyName = "Glass Beam"
  val ProdName    = "MachD"
  val SiteName    = "Glassbeam Admin Portal"

  // flash keys
  val FKSuccess   = "success"
  val FKError     = "error"
  val FKForbidden = "forbidden"
  val FKRedirect =  "redirectAfterLogin"
    
  // UI Related Constants   
  val APIVersion = "v1"
  val InvalidSession = "null"  //// this will be used when session for the user is not valid
  val AppName = "application"    // this is to check the parameter application in request and discard entry in cassandra
  val SupportEmail="support@glassbeam.com"
  val SalesEmail="sales@glassbeam.com"
    
  // flash messages
  val FMLogout = "Successfully signed out."
    
  // Default KeySpace 
  val KsUMS = "ums"
  val KsGB = "glassbeam"
    
  // Default ProductID for campaign
  val ProductRole = "demo_and_studio"

  //h2 tables
  val H2VertClusterConfig = "VERTICA_CLUSTER_CONFIG"
  val H2MPSVertConfig = "VERTICA_MPS_CONFIG"
  //h2 table's columns
  val H2Col_ClusterId = "ClusterId"
  val H2Col_IPs = "IPs"
  val H2Col_VerticaPort = "verticaPort"
  val H2Col_VerticaDb = "verticaDb"
  val H2Col_Username = "Username"
  val H2Col_Password = "Password"
  val H2Col_MPS = "MPS"
  val H2Col_Enabled = "enabled"
  val H2Col_SchemaAppend = "SchemaAppend"
    
  // session keys
  val SKUserId = "id"
  val SKUserName = "name"
  val SKUserOrg = "org"
  val SKUserRole = "role"
  val SKSessionId = "session_id"
  //val SKCustName = "cust_name"
  val SKCurrentTime = "current_time"
  val SKUserMfr = "mfr"
  val SKUserProd = "prod"
  val SKUserSch = "sch"
  val SKUserRealms = "realms"
  val SKUserDomains = "domains"
  val SKUserProjects = "user_projects"
  val SKRemoteAddress = "remote_address"
  val SKMps = "mps"
  val SKUserFName= "first_name"
  val SKUserLName = "last_name"
  val SKProjLimit = "studio_proj_limit"
  val SKFeaturesMps = "features_mps"
  val SKFeatures = "features"
  val SKAdmin = "superadmin"
  val IsSuccess = "OK"
  val SKDashboardAdmin = "dashboard_admin"

  // limits for text database fields
  val FSNameMax = 52
  val FSPasswdMax = 40
  val FSPasswdMin = 6
  val FSCompanyMax = 64

  val CVDefaultInt = 0
  val CVDefaultLong = 0L
  val CVDefaultDouble = 0.0
  val CVDefaultBool = false
  val CVDefaultStr = "NA"    
  val CVDefaultDate = new java.util.Date()
  val CVDefaultDateAsNull = null
  val CVDefaultDateTime = new DateTime()
  val CVDefaultUUID = new java.util.UUID(111L,111L)
    
  val SpaceChar = ' '
  val SpaceStr = " "
  val CommaStr = ","
  val SingleQuote = "'"
  val CommaSingleQuote = "','"
  val Deliminator="-"
  
  object Page extends Enumeration {
    type Page = Value
    val Home, Admin, Basic, Advanced, Account, Error = Value
  }
  
  // constants for the HTTP Status (used for displaying messages)
  object HttpStatus extends Enumeration {
    type HttpStatus = Value
    val Forbidden, BadRequest, NotFound, Error, Success, Information = Value
  }
  
  // constants for user roles
  val URAdmin = "admin"
  val URSupport = "support"
  val URPM = "pm"
  val URMgmt = "management"
  
  //constants for features
  val FeatExplorer = "explorer"
  val FeatWorkBench = "workbench"
  val FeatDashboards = "dashboards"
  val FeatRnA = "rules_and_alerts"
  val FeatApps = "apps"
  val FeatHealthCheck = "healthcheck"
  val FeatLogVault = "logvault"
  val FeatFileUpload = "file_upload"
  val FeatDashboardAdmin = "dashboard_admin"
  val FeatViewer = "viewer"
  
  //constants for dashboards type
  
  val DashTypeInternal = "internal"
  val DashTypeTableau = "tableau"
 
  val DefPermMap = FeatWorkBench + "," + FeatExplorer
  // constants for demo products
  val DemoStor = "1"
  val DemoWireless = "2"
  val DemoMedical = "3"
    
  // constans for application modules
  val ModBase = "basic"
  val ModPM = "pm"
  val ModSP = "support"
  val ModAdmin = "admin"
    
  // GB account
  val GBName = "glassbeam"
  val GBDesc = "machine data analytics"
  val GBUser = "admin@glassbeam.com"
  val GBType = "GB"
  val GBSuper = "glassbeam_super"
  val GBAdmin = "admin"
  val MFRType = "MFR"
  val LandingPageFilePath = "apps/app/admin/managecustomer.html" // super admin will login and will be redirected to this page
  
  //Realms
  val RealmProd = "prod"
  val RealmPoc  = "poc"
  val RealmDemo = "demo"
  val RealmStudioSpl = "gbstudio_spl"
  val RealmStudioApp = "gbstudio_apps"
  val RealmDev = "dev"
    
  // used to limit the number of rows that can be read from col_timeline or event CF
  // since the rows are wide, ideally the data should come from one row
  val RequsetLimit=100
    
  // column family names
  val CFNRealm = "realm"
  val CFNRole = "role"
  val CFNMpseSSO = "mpse_sso"
  val CFNMpseInfo = "mpse_info"
  val CFNUser = "user"
  val CFNProspect = "prospect"
  val CFNCampaigns = "campaigns"
  val CFNUserByOrg = "user_by_org"
  val CFNOrg = "org"
  val CFNOrgByType = "org_by_type"
  val CFNMetaDataCol = "metadata_column"
  val CFNMetaDataTbl = "metadata_table"
  val CFNDashboard= "dashboards"
  val CFNUserActivity = "user_activity"
  val CFNUserByMps = "user_by_mps"
  val CFNUIConfig = "ui_config"
  val CFNEndCustomer = "end_customer"
  val CFNRoleMpsFeatures = "role_mps_features"
  val CFNFeatures = "features"
  val CFNMps = "mps"
  val CFNSsoDetails = "sso_details"
  val CFNRoleRealms = "role_realms"
  val CFNEndCustomerSerials = "end_customer_serials"
  val CFNEndCustomerGroup = "end_customer_group"
  val CFNUserArchive = "user_archive"
  val CFNAlertFilterAttributes = "alert_filter_attributes"
  val CFNRoleMpsFeatureAttributes = "role_mps_feature_attributes"
  val CFNUserDeviceInfo = "user_device_info"
  val CFNNotification = "notification"
  val CFNClinsightsMasterMenu = "clinsights_master_menu"
  val CFNClinsightsMpsMenuNodeHide = "clinsights_mps_menu_node_hide"
  val CFNClinsightsMpsMenuNodeDisable = "clinsights_mps_menu_node_disable"
  val CFNClinsightsRoleMenuNodeHide = "clinsights_role_menu_node_hide"
  val CFNClinsightsRoleMenuNodeDisable = "clinsights_role_menu_node_disable"
  val CFNClinsightsRole = "clinsights_role"
  val CFNClinsightsDashboard = "clinsights_dashboard"
   
  val OrDelimeter = " OR "
  val AndDelimeter = " AND "
    
  val RowKeyColDate = "date"
  val ClusterKeyColTs = "obs_ts"
    
  val ColTypeInt = "i"
  val ColTypeLong = "l"
  val ColTypeFloat = "f"
  val ColTypeDouble = "d"
  val ColTypeStr = "s"
  val ColTypeBool = "b"
  val ColTypeUnknown = "uk"

  val ColDdlInt = "i32"
  val ColDdlLong = "i64"
  val ColDdlFloat = "r32"
  val ColDdlDouble = "r64"

  val OrgTypeMedDemo = 10000
  val OrgTypeGB = 1000
  val OrgTypeStudio = 100
  val OrgTypeMfr = 10
  val OrgTypeEC = 1

  val DummySchema = "S"

  val UserActive = "ACTIVE"
  val UserInactive = "INACTIVE"
  val UserInvited = "INVITED"
  val STR_BOOL = "BOOLEAN"
  val STR_INT = "INT"
  val STR_STR = "STRING"

  // Pardot login URL
  val pardotLoginUrl = "https://pi.pardot.com/api/login/version/4"
  val pardotMailUrl = "https://pi.pardot.com/api/prospect/version/4/do/create/email"
  // Clinsight Error codes and msg
  val clinsightValidationErrorCode = 101
  val clinsightValidationErrorCodeMsg = "Required field(s) missing."
  val clinsightServerErrorCode = 102
  val clinsightServerErrorCodeMsg = "Unable to create user, Please contact support."
  val clinsightAuthErrorCode = 103
  val clinsightAuthErrorCodeMsg = "Only Authorized users allowed."
  val clinsightLoginErrorCode = 104
  val clinsightLoginErrorCodeMsg = "Login Failed, Please contact support."
  val clinsightLoginCredErrorCodeMsg = "Login Failed, Invalid credentials."
  val clinsightLoginInactiveErrorCodeMsg = "Login Failed, User is not active."
  val clinsightSetDefaultErrorCode = 105
  val clinsightSetDefaultErrorCodeMsg = "Unable to set as default, Please contact support."
  val clinsightNoDashboardErrorCode = 106
  val clinsightNoDashboardErrorCodeMsg = "Clinsights not configured, Please contact support."
  val clinsightInternalServerErrorCode = 107
  val clinsightInternalServerErrorCodeMsg = "Internal Server Error, Please contact support."
  // Clinsight Messages
  val clinsightSuccess = "success"
  val clinsightInfo = "info"
  val clinsightError = "error"
  val clinsightWarning = "warning"
  val clinsightRedirectSuccessVerificationMsg = "Your user ID has been successfully verified ! You can now login to your account on Clinsight App and explore clinical insights on your machine data."
  val clinsightRedirectNoUserMsg = "No user found with this email address."
  val clinsightRedirectAlreadyVerifiedMsg = "The email address is already verified."
  val clinsightRedirectAlreadyCreatedMsg = "User is already created with this email address ! Please login using this email address. If you don't remember the password, use the \"forgot password\" link on Clinsight App."
  val clinsightRedirectExpiredMsg = "The verification link is expired.  We’ve once again sent you an email with the verification link at the email address you provided."
  val clinsightRedirectAlreadyRegisteredMsg = "User is already registered with this email address ! We’ve once again sent you an email with the verification link at the email address you provided."
  val clinsightRedirectSuccessSignupMsg = "Thank you for signing up! We’ve sent you an email with the verification link at the email address you provided. Please click on that link and verify your E-mail before you login."
  val clinsightRedirectInvalidTokenMsg = "InValid token."
  val clinsightRedirectInternalServerError = "Unable to register user, Please contact support."

  //DB mapping version
  val VERTICA_VERSION = "v1"
  val CASSANDRA_VERSION = "v2"
  // Rule creator Id
  val RULE_CREATOR_FEATURE_ID = 10

  val SELECT_QRY = "SELECT"
  val UPDATE_QRY = "UPDATE"
  val INSERT_QRY = "INSERT"
  val DELETE_QRY = "DELETE"

  lazy val INCLUDE_TEXT = "INCLUDE"
  lazy val EXCLUDE_TEXT = "EXCLUDE"
  val SQL_ERROR = "FAILURE"

  lazy val FN_CALL_SOURCE_DASHBOARD = "DASHBOARD"
  lazy val FN_CALL_SOURCE_ADMIN_CONSOLE = "ADMIN_CONSOLE"

  lazy val COL_BUNDLE_FIELDS_LMT = 6

  // WS keys
  lazy val WSSuccess = "TaskSuccess"
  lazy val WSFailure = "TaskFailure"
  //All or default explorer date range
  lazy val EXP_DEF_DATE_RANGE = -1

  //app_type
  lazy val APP_TYPE_WEB = 1
  lazy val APP_TYPE_MOBILE = 2

  lazy val JWT_HEADER_TOKEN = "gb_token"

  //clinsight menu node operation
  lazy val TAB_MPS = "mps"
  lazy val TAB_ROLE = "role"

  lazy val TAB_OP_HIDE = "hide"
  lazy val TAB_OP_DISABLE = "disable"

  lazy val CRUD_CREATE = "create"
  lazy val CRUD_READ = "read"
  lazy val CRUD_UPDATE = "update"
  lazy val CRUD_DELETE = "delete"
}
