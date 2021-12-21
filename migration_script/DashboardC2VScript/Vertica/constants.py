vertica_host = 'gbq-cass-03'
vertica_port = 5433
vertica_user = 'gbq'
vertica_password = 'dbadmin123'
vertica_database = 'glassbeam'
buffer_size=65536
vertica_keyspace = 'dashboards'

vertica_table_test_name_suffix = '_testing'

vertica_schema_tables = {
    'dashboards': f'dashboards{vertica_table_test_name_suffix}',
    'dashboard_reports':  f'dashboard_reports{vertica_table_test_name_suffix}',
    'dashboard_role_access': f'dashboard_role_access{vertica_table_test_name_suffix}',
    'dashboard_tags': f'dashboard_tags{vertica_table_test_name_suffix}',
    'dashboard_datasources': f'dashboard_datasources{vertica_table_test_name_suffix}'
}
