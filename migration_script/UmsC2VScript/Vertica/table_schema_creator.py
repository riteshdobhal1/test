import vertica_python
from Vertica import connector as v_conn, constants as vc

connection_info = v_conn.connectionData()

vertica_tables = vc.vertica_schema_tables

KSUMS = "va_ums"

def createConnection(connection_info):
    with vertica_python.connect(**connection_info) as connection:
        return connection

def createCursor(connection):
    cursor = connection.cursor()
    return cursor

def closeCursor(cursor):
    cursor.close()

def closeConnection(connection):
    connection.close()

def realmSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} (
        realm_id AUTO_INCREMENT PRIMARY KEY NOT NULL,
        realm varchar(128),
        is_url varchar(256),
        ui_url varchar(256),
        apps_version varchar(32),
        vertica_port varchar(128),
        vertica_pwd varchar(128),
        vertica_server varchar(128),
        vertica_user varchar(128),
        CONSTRAINT C_UNIQUE UNIQUE(realm) ENABLED 
        );"""

def mpsSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        mps varchar(128) NOT NULL, 
        mfr_id int, 
        mps_label varchar(128),
        CONSTRAINT C_PRIMARY PRIMARY KEY (mps) ENABLED 
        );"""

def orgSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        mfr_id int NOT NULL, 
        name varchar(128), 
        description varchar(256), 
        type int, 
        max_users int, 
        max_licensed_users int, 
        two_auth_enabled boolean, 
        max_creator_licenses int, 
        email_template_body varchar(500), 
        email_template_subject varchar(50), 
        email_template_header varchar(100), 
        email_template_footer varchar(100), 
        email_template_link varchar(50), 
        email_template_link_expiry varchar(20), 
        two_auth_trigger_duration int,
        max_viewer_licenses int,
        end_customer_domain varchar(100), 
        CONSTRAINT C_PRIMARY PRIMARY KEY (mfr_id) ENABLED 
        );"""

def userActivitySchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} (
        mps varchar(255),
        email varchar(255),	 
        sess_id varchar(255),	 
        app varchar(128),	 
        module varchar(128),	 
        switched_feature varchar(128),	 
        start_ts timestamp	, 
        end_ts timestamp	, 
        solr_qry varchar(4096),	 
        details varchar(4096),	 
        activity varchar(128),
        month int
        );"""

def ssoDetailsSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        mps varchar(128), 
        realm varchar(128), 
        sso_login_url varchar(128), 
        sso_logout_url varchar(128), 
        sso_idp_id varchar(128), 
        active boolean, 
        logo varchar(128), 
        logo_url varchar(256), 
        default_feature_internal varchar(128), 
        default_feature_external varchar(128), 
        nsr_enabled boolean, 
        logi_auth_url varchar(1024), 
        email_signature varchar(2048), 
        signature_url varchar(2048), 
        contact_email varchar(128), 
        feature_label varchar(2048),
        logo_internal varchar(128),
        CONSTRAINT C_PRIMARY PRIMARY KEY (mps,realm) ENABLED  
        );"""

def roleSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        role_id IDENTITY , 
        role_name varchar(128), 
        super boolean, 
        max_limit_proj int, 
        two_auth_support varchar(128),
        mfr_id int,
        CONSTRAINT C_PRIMARY PRIMARY KEY (role_id) ENABLED, CONSTRAINT C_UNIQUE UNIQUE(role_name,mfr_id) ENABLED
        );"""

def roleMpsFeaturesSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        mps varchar(128), 
        feature_id int, 
        role_id int NOT NULL 
        );"""

def roleRealmsSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        realm_id int, 
        role_id int NOT NULL 
        );"""

def featuresSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        feature_id int NOT NULL, 
        feature_name varchar(128), 
        feature_label varchar(256), 
        active boolean, 
        CONSTRAINT pk PRIMARY KEY (feature_id, feature_name) ENABLED 
        );"""

def userSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        email varchar(255) NOT NULL, 
        first_name varchar(255), 
        last_name varchar(255), 
        passwd_hash varchar(255), 
        def_passwd boolean, 
        realm_id int, 
        url_def varchar(255), 
        mps_def varchar(128), 
        type varchar(255), 
        campaigns varchar(255), 
        validated boolean, 
        is_prospect boolean, 
        mfr_id int, 
        department varchar(255), 
        phone varchar(255), 
        city varchar(255), 
        state varchar(255), 
        country varchar(255), 
        sso boolean, 
        role_id int, 
        wb_user_name varchar(255), 
        is_external boolean, 
        report_usage boolean, 
        created_on timestamp, 
        token_id varchar(255), 
        dashboard_admin boolean, 
        region varchar(255), 
        show_info boolean, 
        expire_in_days int, 
        org varchar(255), 
        realm_def varchar(255), 
        end_customer varchar(255), 
        events_export_limit int, 
        failed_login int, 
        last_failed_login_time timestamp, 
        modified_on timestamp, 
        remote_address varchar(255), 
        active int, 
        last_login_otp timestamp, 
        CONSTRAINT C_PRIMARY PRIMARY KEY (email) ENABLED 
        );"""

def prospectSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        email varchar(255) NOT NULL, 
        first_name varchar(255), 
        last_name varchar(255), 
        passwd_hash varchar(255), 
        org varchar(255), 
        phone varchar(255), 
        city varchar(255), 
        state varchar(255), 
        country varchar(255), 
        created_on timestamp, 
        veri_code varchar(255), 
        role varchar(255), 
        realm_def varchar(255), 
        url_def varchar(255), 
        mps_def varchar(255), 
        campaigns varchar(512), 
        company_name varchar(255), 
        CONSTRAINT pk PRIMARY KEY (email) ENABLED 
        );"""

def endCustomerSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        endcustomer_id IDENTITY,
        mps varchar(128), 
        endcustomer_name varchar(128), 
        dashboard_enabled boolean, 
        created_by varchar(128), 
        updated_on timestamp, 
        CONSTRAINT C_PRIMARY PRIMARY KEY (endcustomer_id) ENABLED,
        CONSTRAINT C_UNIQUE UNIQUE(mps, endcustomer_name) ENABLED
        );"""

def endCustomerSerialsSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} (
        serial_number varchar(128),
        endcustomer_id int NOT NULL 
        );"""

def userByMpsSchemaQuery(tableName):
    return f"""CREATE TABLE {KSUMS}.{tableName} ( 
        mps varchar(128), 
        email varchar(256), 
        last_access timestamp, 
        last_login timestamp, 
        last_logout timestamp, 
        last_sess_id varchar(255), 
        otp varchar(128), 
        otp_generation_time timestamp,
        first_name varchar(50),
        last_name varchar(50),
        CONSTRAINT C_PRIMARY PRIMARY KEY (mps,email) ENABLED 
        );"""

with vertica_python.connect(**connection_info) as connection:
    cursor = connection.cursor()
    for table in vertica_tables:
        if table == 'mps':
            cursor.execute(mpsSchemaQuery(vertica_tables[table]))
        elif table == 'realm':
            cursor.execute(realmSchemaQuery(vertica_tables[table]))
        elif table == 'org':
            cursor.execute(orgSchemaQuery(vertica_tables[table]))
        elif table == 'user_activity':
            cursor.execute(userActivitySchemaQuery(vertica_tables[table]))
        elif table == 'sso_details':
            cursor.execute(ssoDetailsSchemaQuery(vertica_tables[table]))
        elif table == 'role':
            cursor.execute(roleSchemaQuery(vertica_tables[table]))
        elif table == 'role_mps_features':
            cursor.execute(roleMpsFeaturesSchemaQuery(vertica_tables[table]))
        elif table == 'role_realms':
            cursor.execute(roleRealmsSchemaQuery(vertica_tables[table]))
        elif table == 'features':
            cursor.execute(featuresSchemaQuery(vertica_tables[table]))
        elif table == 'user':
            cursor.execute(userSchemaQuery(vertica_tables[table]))
        elif table == 'prospect':
            cursor.execute(prospectSchemaQuery(vertica_tables[table]))
        elif table == 'end_customer':
            cursor.execute(endCustomerSchemaQuery(vertica_tables[table]))
        elif table == 'end_customer_serials':
            cursor.execute(endCustomerSerialsSchemaQuery(vertica_tables[table]))
        elif table == 'user_by_mps':
            cursor.execute(userByMpsSchemaQuery(vertica_tables[table]))
    closeCursor(cursor)
    closeConnection(connection)
