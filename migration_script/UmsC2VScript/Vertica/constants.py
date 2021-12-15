vertica_host = 'gbq-searchdev-01'
vertica_port = 5433
vertica_user = 'gbq'
vertica_password = 'Gla55Beam'
vertica_database = 'glassbeam'
buffer_size=65536
vertica_keyspace = 'va_ums'

vertica_table_test_name_suffix = ''

vertica_schema_tables = {
    'user_activity': f'user_activity{vertica_table_test_name_suffix}',
    'realm' : f'realm{vertica_table_test_name_suffix}',
    'org':  f'org{vertica_table_test_name_suffix}',
    'user_by_mps': f'user_by_mps{vertica_table_test_name_suffix}',
    'end_customer': f'end_customer{vertica_table_test_name_suffix}',
    'end_customer_serials': f'end_customer_serials{vertica_table_test_name_suffix}',
    'sso_details': f'sso_details{vertica_table_test_name_suffix}',
    'mps' : f'mps{vertica_table_test_name_suffix}',
    'features': f'features{vertica_table_test_name_suffix}',
    'role': f'role{vertica_table_test_name_suffix}',
    'role_mps_features': f'role_mps_features{vertica_table_test_name_suffix}',
    'role_realms': f'role_realms{vertica_table_test_name_suffix}',
    'user': f'user{vertica_table_test_name_suffix}',
    'prospect': f'prospect{vertica_table_test_name_suffix}'
}

vertica_tables = {
    #'user_activity': f'user_activity{vertica_table_test_name_suffix}',
    #'realm' : f'realm{vertica_table_test_name_suffix}',
    #'org': f'org{vertica_table_test_name_suffix}',
    #'user_by_mps': f'user_by_mps{vertica_table_test_name_suffix}',
    #'end_customer': f'end_customer{vertica_table_test_name_suffix}',
    #'end_customer_serials': f'end_customer_serials{vertica_table_test_name_suffix}',
    #'sso_details': f'sso_details{vertica_table_test_name_suffix}',
    #'mps': f'mps{vertica_table_test_name_suffix}',
    #'features': f'features{vertica_table_test_name_suffix}',
    #'role': f'role{vertica_table_test_name_suffix}',
    'role_mps_features': f'role_mps_features{vertica_table_test_name_suffix}',
    'role_realms': f'role_realms{vertica_table_test_name_suffix}',
    'user': f'user{vertica_table_test_name_suffix}',
    'prospect': f'prospect{vertica_table_test_name_suffix}'
}

features_table = [
    {
        'feature_id':1,
        'feature_name':'explorer',
        'feature_label':'Explorer',
        'active':True
    },
    {
        'feature_id':2,
        'feature_name':'dashboards',
        'feature_label':'Dashboard',
        'active':True
    },
    {
        'feature_id': 3,
        'feature_name': 'healthcheck',
        'feature_label': 'Health Check',
        'active': True
    },
    {
        'feature_id': 4,
        'feature_name': 'logvault',
        'feature_label': 'Logvault',
        'active': True
    },
    {
        'feature_id': 5,
        'feature_name': 'file_upload',
        'feature_label': 'File Upload',
        'active': True
    },
    {
        'feature_id': 6,
        'feature_name': 'rules_and_alerts',
        'feature_label': 'Rules & Alerts',
        'active': True
    },
    {
        'feature_id': 7,
        'feature_name': 'workbench',
        'feature_label': 'Workbench',
        'active': True
    },
    {
        'feature_id': 8,
        'feature_name': 'dashboard_admin',
        'feature_label': 'Dasboard Admin',
        'active': True
    },
    {
        'feature_id': 9,
        'feature_name': 'admin',
        'feature_label': 'Admin Console',
        'active': True
    },
    {
        'feature_id': 10,
        'feature_name': 'rule_creator',
        'feature_label': 'Rule Creator',
        'active': True
    },
    {
        'feature_id': 11,
        'feature_name': 'wb_creator',
        'feature_label': 'Creator',
        'active': True
    },
    {
        'feature_id': 12,
        'feature_name': 'viewer',
        'feature_label': 'Viewer',
        'active': True
    }
]
