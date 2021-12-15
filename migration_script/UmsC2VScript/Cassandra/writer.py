from Cassandra import connector as c_conn, constants as cc
from Vertica import connector as v_conn, constants as vc
import json,csv
csv.register_dialect('myDialect', delimiter=f'{cc.cass_csv_delimiter}', quoting=csv.QUOTE_NONE, escapechar='\"')

def verticaSelectQuery(q):
    return v_conn.verticaSelectQuery(q)

def getJsonData(rows):
    result = []
    for row in rows:
        result.append(row[0])
    return result

def getCassandraJsonRows(session, table_name):
    return session.execute(f'SELECT json * from {table_name}')

def getCassandraRows(session, table_name):
    if table_name is 'user_activity' and cc.cassandra_user_activity_monthly_data is True:
        qry = f'SELECT * from {table_name} where start_ts >= {cc.cassandra_user_activity["start_ts"]} ALLOW FILTERING'
    elif table_name is 'mps' or table_name is 'role_mps_features' or table_name is 'role_realms':
        qry = f'SELECT * from role'
    elif table_name is 'end_customer' or table_name is 'end_customer_serials':
        qry = f'SELECT * from end_customer'
    else:
        qry = f'SELECT * from {table_name}'
    return session.execute(qry)

def dumpCassJson(rows, fileName):
    with open(f'../json/cass-json/{fileName}.json', 'w') as outfile:
        res = getJsonData(rows)
        json.dump(res, outfile)

def dumpCassCsv(fileName):
    with open(f'cass-csv/{fileName}.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        with open(f'../json/cass-json/{fileName}.json') as fh:
            x = json.load(fh)
            for row in x:
                row = json.loads(row)
                csv_file.writerow(row.values())

def get_role_mfrid(row):
    if row.domains is not None:
        distinct_domains = {value.split(':')[0] for (key,value) in row.domains.items()}
        if len(distinct_domains) is 1 or (len(distinct_domains) is 2 and distinct_domains.__contains__('default')):
            org = distinct_domains.difference({'default'}).pop()
        else:
            org = 'glassbeam'
        mfr_available = verticaSelectQuery(f"select mfr_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['org']} where name='{org}'")
        if len(mfr_available) is not 0:
            mfr_id = mfr_available[0][0]
        else:
            mfr_id = None
        return mfr_id
    else:
        return None

def get_role_mfr(row):
    if row.domains is not None:
        distinct_domains = {value.split(':')[0] for (key,value) in row.domains.items()}
        if len(distinct_domains) is 1 or (len(distinct_domains) is 2 and distinct_domains.__contains__('default')):
            org = distinct_domains.difference({'default'}).pop()
        else:
            org = 'glassbeam'
        mfr_available = verticaSelectQuery(f"select name from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['org']} where name='{org}'")
        if len(mfr_available) is not 0:
            mfr_name = mfr_available[0][0]
        else:
            mfr_name = None
        return mfr_name

def dumpVertCsvFeatures():
    with open(f'vert-csv/features.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        rows = vc.features_table
        for row in rows:
            new_row = {}
            new_row['feature_id'] = row['feature_id']
            new_row['feature_name'] = row['feature_name']
            new_row['feature_label'] = row['feature_label']
            new_row['active'] = row['active']
            print(new_row)
            csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvMps(rows):
    with open(f'vert-csv/mps.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        acc = dict()
        for row in rows:
            roleName = row.name.lower()
            if roleName.endswith('admin'):
                if row.domains is not None:
                    domains = {'/'.join(value.split(':')):key for key, value in row.domains.items()}
                    for domain in domains:
                        if domain not in acc:
                            acc[domain] = domain
                            mfr_available = verticaSelectQuery(f"select mfr_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['org']} where name='{domain.split('/')[0]}'")
                            if len(mfr_available) is not 0:
                                mfr_id = mfr_available[0][0]
                            else:
                                mfr_id = None
                            new_row = {}
                            new_row['mps'] = domain
                            new_row['mfr_id'] = mfr_id
                            new_row['mps_label'] = domains[domain]
                            incExcAll = includeExclude()
                            if incExcAll is cc.EXCLUDE_TEXT:
                                if domain is not '' or domain is not None:
                                    if domain.split("/")[0] not in cc.customers:
                                        csv_file.writerow(new_row.values())
                            elif incExcAll is cc.INCLUDE_TEXT:
                                if domain is not '' or domain is not None:
                                    if domain.split("/")[0] in cc.customers:
                                        csv_file.writerow(new_row.values())
                            else:
                                csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvRoleMpsFeatures(rows):
    with open(f'vert-csv/role_mps_features.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        for row in rows:
            roleName = row.name
            rids = verticaSelectQuery(f"select role_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['role']} where role_name = '{roleName.lower()}'")
            if len(rids) is not 0:
                rid = rids[0][0]
                if row.permissions is not None:
                    domainList = [*row.permissions.keys()]
                    for domain in domainList:
                        featureList = row.permissions[domain].split(',')
                        f_names = ''
                        for ftr in featureList:
                            if len(f_names) == 0:
                                f_names = f_names + f"'{ftr.strip()}'"
                            else:
                                f_names = f_names + ',' + f"'{ftr.strip()}'"
                        features = verticaSelectQuery(f'select feature_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables["features"]} where feature_name in ({f_names})')
                        for fids in features:
                            if len(fids) is not 0:
                                fid = fids[0]
                                new_row = {}
                                new_row['mps'] = '/'.join(domain.split(':'))
                                new_row['feature_id'] = fid
                                new_row['role_id'] = rid
                                incExcAll = includeExclude()
                                if incExcAll is cc.EXCLUDE_TEXT:
                                    if domain is not '' or domain is not None:
                                        if domain.split(":")[0] not in cc.customers:
                                            csv_file.writerow(new_row.values())
                                elif incExcAll is cc.INCLUDE_TEXT:
                                    if domain is not '' or domain is not None:
                                        if domain.split(":")[0] in cc.customers:
                                            csv_file.writerow(new_row.values())
                                else:
                                    csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvRoleRealms(rows):
    with open(f'vert-csv/role_realms.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        for row in rows:
            roleName = row.name
            role_id_rows = verticaSelectQuery(f"select role_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['role']} where role_name = '{roleName.lower()}'")
            if len(role_id_rows) is not 0:
                role_id = role_id_rows[0][0]
                realm_names = ''
                realm_ids = ''
                if row.realm is not None:
                    for rname in row.realm:
                        if len(realm_names) == 0:
                            realm_names = realm_names + f"'{rname.strip()}'"
                        else:
                            realm_names = realm_names + ',' + f"'{rname.strip()}'"
                    realm_list = verticaSelectQuery(f'select realm_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables["realm"]} where realm in ({realm_names})')
                    realm_ids = ''
                    for rids in realm_list:
                        rid = ''
                        if len(rids) is not 0:
                            rid = rids[0]
                        if len(realm_ids) == 0:
                            realm_ids = realm_ids + f"{rid}"
                        else:
                            realm_ids = realm_ids + ',' + f"{rid}"
                new_realm_ids_list = realm_ids.split(',')
                for new_rid in new_realm_ids_list:
                    if new_rid is not None and new_rid is not '':
                        new_row = {}
                        new_row['realm_id'] = new_rid
                        new_row['role_id'] = role_id
                        csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvEndCustomerSerials(rows):
    with open(f'vert-csv/end_customer_serials.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        for row in rows:
            ecName = row.endcustomer_name
            ec_id_rows = verticaSelectQuery(f"select endcustomer_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['end_customer']} where endcustomer_name = '{ecName}'")
            if len(ec_id_rows) is not 0:
                ec_id = ec_id_rows[0][0]
                if row.serial_number is not None:
                    for serial in row.serial_number:
                        if serial is not None and serial is not '':
                            new_row = {}
                            new_row['serial_number'] = serial
                            new_row['endcustomer_id'] = ec_id
                            csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvTables(vert_table_name, fileName, rows):
    filePath = f'vert-csv/{vert_table_name}.csv'
    with open(filePath, 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        count_id = 1
        for row in rows:
            if fileName == 'mps':
                new_row = getMpsData(row)
            elif fileName == 'realm':
                new_row = getRealmData(row)
            elif fileName == 'org':
                new_row = getOrgData(row, count_id)
            elif fileName == 'user_activity':
                new_row = getUserActivityData(row)
            elif fileName == 'mpse_sso':
                new_row = getSsoDetailsData(row)
            elif fileName == 'role':
                new_row = getRoleData(row)
            elif fileName == 'role_mps_features':
                new_row = getRoleMpsFeaturesData(row)
            elif fileName == 'features':
                new_row = getFeaturesData(row)
            elif fileName == 'user':
                new_row = getUserData(row)
            elif fileName == 'prospect':
                new_row = getProspectData(row)
            elif fileName == 'end_customer':
                new_row = getEndCustomerData(row)
            elif fileName == 'user_by_mps':
                new_row = getUserByMpsData(row)
            if bool(new_row):
                print(f'new csv row : {new_row}')
                csv_file.writerow(new_row.values())
                count_id = count_id + 1
        outfile.close()

def dumpVertCsv(rows, fileName):
    if fileName == 'mpse_sso':
        vert_table_name = 'sso_details'
    else:
        vert_table_name = fileName
    if fileName == 'mps':
        dumpVertCsvFeatures()
        dumpVertCsvMps(rows)
    elif fileName == 'role':
        role_rows = getCassandraRows(session, 'role')
        dumpVertCsvTables(vert_table_name, fileName, role_rows)
    elif fileName == 'role_mps_features':
        role_features_rows = getCassandraRows(session, 'role')
        dumpVertCsvRoleMpsFeatures(role_features_rows)
    elif fileName == 'role_realms':
        role_realms_rows = getCassandraRows(session, 'role')
        dumpVertCsvRoleRealms(role_realms_rows)
    elif fileName == 'end_customer':
        end_cust_rows = getCassandraRows(session, 'end_customer')
        dumpVertCsvTables(vert_table_name, fileName, end_cust_rows)
    elif fileName == 'end_customer_serials':
        end_cust_serials_rows = getCassandraRows(session, 'end_customer')
        dumpVertCsvEndCustomerSerials(end_cust_serials_rows)
    else:
        dumpVertCsvTables(vert_table_name, fileName, rows)

def ifNotValue(row, prop):
    if row.get(prop) is not None:
        row[prop]
    else:
        None

def getRealmData(row):
    new_row = {}
    new_row['realm'] = row.name
    new_row['is_url'] = row.is_url
    new_row['ui_url'] = row.ui_url
    new_row['apps_version'] = row.apps_version
    new_row['vertica_port'] = row.vertica_port
    new_row['vertica_pwd'] = row.vertica_pwd
    new_row['vertica_server'] = row.vertica_server
    new_row['vertica_user'] = row.vertica_user
    return new_row

def getMpsData(row):
    def getNewRow(row):
        new_row = {}
        new_row['mps'] = row.mps
        new_row['mfr_id'] = row.mfr_id
        new_row['mfr_label'] = row.mfr_label
        return new_row
    new_row = {}
    incExcAll = includeExclude()
    if incExcAll is cc.EXCLUDE_TEXT:
        if row.mps is not '' or row.mps is not None:
            if row.mps.split("/")[0] not in cc.customers:
                new_row = getNewRow(row)
    elif incExcAll is cc.INCLUDE_TEXT:
        if row.mps is not '' or row.mps is not None:
            if row.mps.split("/")[0] in cc.customers:
                new_row = getNewRow(row)
    else:
        new_row = getNewRow(row)
    return new_row

def getOrgData(row, mfr_id):
    def getNewRow(row, mfr_id):
        new_row = {}
        new_row['mfr_id'] = mfr_id
        new_row['name'] = row.name
        new_row['description'] = row.description
        new_row['type'] = row.type
        new_row['max_users'] = row.max_users
        new_row['max_licensed_users'] = row.max_licensed_users
        new_row['two_auth_enabled'] = row.two_auth_enabled
        new_row['max_creator_licenses'] = row.max_creator_licenses
        new_row['email_template_body'] = row.email_template_body
        new_row['email_template_subject'] = row.email_template_subject
        new_row['email_template_header'] = row.email_template_header
        new_row['email_template_footer'] = row.email_template_footer
        new_row['email_template_link'] = None  # row.email_template_link
        new_row['email_template_link_expiry'] = None  # row.email_template_link_expiry
        new_row['two_auth_trigger_duration'] = row.two_auth_trigger_duration
        new_row['max_viewer_licenses'] = None  # row.max_viewer_licenses
        new_row['end_customer_domain'] = row.end_customer_domain
        return new_row
    new_row = {}
    incExcAll = includeExclude()
    if incExcAll is cc.EXCLUDE_TEXT:
        if row.name is not '' or row.name is not None:
            if row.name not in cc.customers:
                new_row = getNewRow(row, mfr_id)
    elif incExcAll is cc.INCLUDE_TEXT:
        if row.name is not '' or row.name is not None:
            if row.name in cc.customers:
                new_row = getNewRow(row, mfr_id)
    else:
        new_row = getNewRow(row, mfr_id)
    return new_row

def getUserActivityData(row):
    def getNewRow(row):
        new_row = {}
        new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
        new_row['email'] = row.email
        new_row['sess_id'] = row.sess_id
        new_row['app'] = row.app
        new_row['module'] = row.module
        new_row['switched_feature'] = row.switched_feature
        new_row['start_ts'] = row.start_ts
        new_row['end_ts'] = row.end_ts
        new_row['solr_qry'] = row.solr_qry
        if row.details is not None and len(row.details) > 0:
            list_of_strings = row.details[0]
        else:
            list_of_strings = None
        new_row['details'] = list_of_strings
        new_row['activity'] = row.activity
        new_row['month'] = row.month
        return new_row
    return getNewRowData(row, row.mfr, getNewRow)

def getSsoDetailsData(row):
    def getNewRow(row):
        new_row = {}
        mpse_info_rows = session.execute(
            f"SELECT * from mpse_info where mfr='{row.mfr}' and prod='{row.prod}' AND sch='{row.sch}'")
        print(f'mpse info and sso : {mpse_info_rows}')
        mpse_info_row = mpse_info_rows.one()
        if mpse_info_row is not None:
            new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
            new_row['realm'] = row.realm
            new_row['sso_login_url'] = row.sso_login_url
            new_row['sso_logout_url'] = row.sso_logout_url
            new_row['sso_idp_id'] = row.sso_idp_id
            new_row['active'] = mpse_info_row.active
            new_row['logo'] = mpse_info_row.logo
            new_row['logo_url'] = mpse_info_row.logo_url
            new_row['default_feature_internal'] = mpse_info_row.default_feature_internal
            new_row['default_feature_external'] = mpse_info_row.default_feature_external
            new_row['nsr_enabled'] = mpse_info_row.nsr_enabled
            new_row['logi_auth_url'] = mpse_info_row.logi_auth_url
            new_row['email_signature'] = mpse_info_row.email_signature
            new_row['signature_url'] = mpse_info_row.signature_url
            new_row['contact_email'] = mpse_info_row.contact_email
            if mpse_info_row.feature_label is not None:
                new_row['feature_label'] = ','.join(mpse_info_row.feature_label)
            else:
                new_row['feature_label'] = None
            new_row['logo_internal'] = None #mpse_info_row.logo_internal
            return new_row
        else:
            new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
            new_row['realm'] = row.realm
            new_row['sso_login_url'] = row.sso_login_url
            new_row['sso_logout_url'] = row.sso_logout_url
            new_row['sso_idp_id'] = row.sso_idp_id
            new_row['active'] = None
            new_row['logo'] = None
            new_row['logo_url'] = None
            new_row['default_feature_internal'] = None
            new_row['default_feature_external'] = None
            new_row['nsr_enabled'] = None
            new_row['logi_auth_url'] = None
            new_row['email_signature'] = None
            new_row['signature_url'] = None
            new_row['contact_email'] = None
            new_row['feature_label'] = None
            return new_row
    return getNewRowData(row, row.mfr, getNewRow)

def getRoleData(row):
    def getNewRow(row):
        new_row = {}
        new_row['role_name'] = row.name
        new_row['super'] = row.super
        realm_names = ''
        realm_ids = ''
        if row.realm is not None:
            for rname in row.realm:
                if len(realm_names) == 0:
                    realm_names = realm_names + f"'{rname.strip()}'"
                else:
                    realm_names = realm_names + ',' + f"'{rname.strip()}'"
            realm_list = verticaSelectQuery(
                f'select realm_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables["realm"]} where realm in ({realm_names})')
            realm_ids = ''
            for rids in realm_list:
                rid = ''
                if len(rids) is not 0:
                    rid = rids[0]
                if len(realm_ids) == 0:
                    realm_ids = realm_ids + f"{rid}"
                else:
                    realm_ids = realm_ids + ',' + f"{rid}"
        new_row['max_limit_proj'] = row.max_limit_proj
        if row.two_auth_support is not None:
            new_row['two_auth_support'] = ','.join(row.two_auth_support)
        else:
            new_row['two_auth_support'] = None
        new_row['mfr_id'] = get_role_mfrid(row)
        return new_row
    mfr_name = get_role_mfr(row)
    return getNewRowData(row, mfr_name, getNewRow)

def getRoleMpsFeaturesData(row):
    def getNewRow(row):
        new_row = {}
        new_row['mps'] = row.mps
        new_row['feature_id'] = row.feature_id
        new_row['role_id'] = row.role_id
        return new_row
    new_row = {}
    incExcAll = includeExclude()
    if incExcAll is cc.EXCLUDE_TEXT:
        if row.mps is not '' or row.mps is not None:
            if row.mps.split("/")[0] not in cc.customers:
                new_row = getNewRow(row)
    elif incExcAll is cc.INCLUDE_TEXT:
        if row.mps is not '' or row.mps is not None:
            if row.mps.split("/")[0] in cc.customers:
                new_row = getNewRow(row)
    else:
        new_row = getNewRow(row)
    return new_row

def getFeaturesData(row):
    new_row = {}
    new_row['feature_id'] = row.feature_id
    new_row['feature_name'] = row.feature_name
    new_row['feature_label'] = row.feature_label
    new_row['active'] = row.active
    return new_row

def getEndCustomerData(row):
    def getNewRow(row):
        new_row = {}
        new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
        new_row['endcustomer_name'] = row.endcustomer_name
        new_row['dashboard_enabled'] = None
        new_row['created_by'] = row.created_by
        new_row['updated_on'] = row.updated_on
        return new_row
    return getNewRowData(row, row.mfr, getNewRow)

def getUserByMpsData(row):
    def getNewRow(row):
        new_row = {}
        new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
        new_row['email'] = row.email
        new_row['last_access'] = row.last_access
        new_row['last_login'] = row.last_login
        new_row['last_logout'] = row.last_logout
        new_row['last_sess_id'] = row.last_sess_id
        new_row['otp'] = row.otp
        new_row['otp_generation_time'] = row.otp_generation_time
        new_row['first_name'] = row.first_name
        new_row['last_name'] = row.last_name
        return new_row
    return getNewRowData(row, row.mfr, getNewRow)

def getProspectData(row):
    def getNewRow(row):
        new_row = {}
        new_row['email'] = row.email
        new_row['first_name'] = row.first_name
        new_row['last_name'] = row.last_name
        new_row['passwd_hash'] = row.passwd_hash
        new_row['org'] = row.org
        new_row['phone'] = row.phone
        new_row['city'] = row.city
        new_row['state'] = row.state
        new_row['country'] = row.country
        new_row['created_on'] = row.created_on
        new_row['veri_code'] = row.veri_code
        new_row['role'] = row.role
        new_row['realm_def'] = row.realm_def
        new_row['url_def'] = row.url_def
        new_row['mps_def'] = row.mps_def
        new_row['campaigns'] = row.campaigns
        new_row['company_name'] = row.company_name
        return new_row
    return getNewRowData(row, row.org, getNewRow)

def getUserData(row):
    def getNewRow(row):
        new_row = {}
        if row.mps_def is not None and len(row.mps_def.split(':')) is 3:
            mps_def = '/'.join(row.mps_def.split(':'))
        else:
            mps_def = None
        user_state = {None: 0, True: 1, False: 2}
        # mps_def = '/'.join(row.mps_def.split(':'))
        if row.role is None:
            cass_role = ''
        else:
            cass_role = row.role.lower()
        realm_id = verticaSelectQuery(
            f"select realm_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['realm']} where ui_url = '{row.realm_def}'")
        role_id = verticaSelectQuery(
            f"select role_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['role']} where role_name = '{cass_role}'")
        mfr_id = []
        if row.org is not None:
            mfr_id = verticaSelectQuery(
                f"select mfr_id from {vc.vertica_keyspace}.{cc.cassandra_vertica_dependent_tables['org']} where name = '{row.org}'")
        if len(realm_id) is 0:
            realmId = None
        else:
            realmId = realm_id[0][0]
        if len(role_id) is 0:
            roleId = None
        else:
            roleId = role_id[0][0]
        if len(mfr_id) is 0:
            mfrId = None
        else:
            mfrId = mfr_id[0][0]

        new_row['email'] = row.email
        new_row['first_name'] = row.first_name
        new_row['last_name'] = row.last_name
        new_row['passwd_hash'] = row.passwd_hash
        new_row['def_passwd'] = row.def_passwd
        new_row['realm_id'] = realmId
        new_row['url_def'] = row.url_def
        new_row['mps_def'] = mps_def
        new_row['type'] = row.type
        new_row['campaigns'] = row.campaigns
        new_row['validated'] = row.validated
        new_row['is_prospect'] = row.is_prospect
        new_row['mfr_id'] = mfrId
        new_row['department'] = row.department
        new_row['phone'] = row.phone
        new_row['city'] = row.city
        new_row['state'] = row.state
        new_row['country'] = row.country
        new_row['sso'] = row.sso
        new_row['role_id'] = roleId
        new_row['wb_user_name'] = row.wb_user_name
        new_row['is_external'] = row.is_external
        new_row['report_usage'] = row.report_usage
        new_row['created_on'] = row.created_on
        new_row['token_id'] = row.token_id
        new_row['dashboard_admin'] = row.dashboard_admin
        new_row['region'] = row.region
        new_row['show_info'] = row.show_info
        new_row['expire_in_days'] = row.expire_in_days
        new_row['org'] = row.org
        new_row['realm_def'] = row.realm_def
        new_row['end_customer'] = row.end_customer
        new_row['events_export_limit'] = row.events_export_limit
        new_row['failed_login'] = row.failed_login
        new_row['last_failed_login_time'] = row.last_failed_login_time
        new_row['modified_on'] = row.modified_on
        new_row['remote_address'] = None  # row.remote_address
        new_row['active'] = user_state[row.active]
        new_row['last_login_otp'] = None  # row.last_login_otp
        return new_row
    return getNewRowData(row, row.org, getNewRow)

def getNewRowData(row, mfr, getNewRow):
    new_row = {}
    incExcAll = includeExclude()
    if incExcAll is cc.EXCLUDE_TEXT:
        if mfr != '' and mfr is not None:
            if mfr not in cc.customers:
                new_row = getNewRow(row)
    elif incExcAll is cc.INCLUDE_TEXT:
        if mfr != '' and mfr is not None:
            if mfr in cc.customers:
                new_row = getNewRow(row)
    else:
        new_row = getNewRow(row)
    return new_row

def includeExclude():
    if cc.include_customers is True and cc.exclude_customers is True:
        return cc.INCLUDE_ALL
    if cc.include_customers is True:
        return cc.INCLUDE_TEXT
    elif cc.exclude_customers is True:
        return cc.EXCLUDE_TEXT
    else:
        return cc.INCLUDE_ALL

cluster = c_conn.createCluster()
session = c_conn.createSession(cluster, cc.cassandra_keyspace)
if __name__ == "__main__":
    for table in cc.cassandra_tables:
        tableData = getCassandraRows(session, table)
        # dumpCassJson(tableData, table)
        # dumpCassCsv(table)
        dumpVertCsv(tableData, table)
        #copyDataToVertica(table)
else:
    for table in cc.cassandra_tables:
        tableData = getCassandraRows(session, table)
        # dumpCassJson(tableData, table)
        # dumpCassCsv(table)
        dumpVertCsv(tableData, table)
