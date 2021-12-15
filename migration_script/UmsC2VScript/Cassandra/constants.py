cassandra_host = ['gbq-cass-03']
cassandra_keyspace = 'ums'
cass_csv_delimiter = '|'
vertica_table_test_name_suffix = '_test'

customers = ['']

INCLUDE_TEXT = 'INLCUDE'
EXCLUDE_TEXT = 'EXCLUDE'
INCLUDE_ALL = 'ALL'
# keep exclude_customers & include_customers False to include all
exclude_customers = False
include_customers = False

#cassandra_tables = ['user_activity']
#cassandra_tables = ['realm','org','user_by_mps','end_customer']
#cassandra_tables = ['end_customer_serials', 'mpse_sso', 'mps']  #"mpse_sso" requires cassandra "glassbeam.mpse_info" data under ums keyspace
#cassandra_tables = ['role']
cassandra_tables = ['role_mps_features', 'role_realms', 'user', 'prospect']

cassandra_user_activity_monthly_data = False # Please do not update the value to True, after making it to True cassandra query with ALLOW FILTERING will be executed and thus may have unpredictable performance.
cassandra_user_activity = {
    'start_ts': 1600866119000
}

cassandra_vertica_dependent_tables = {
    'mps' : f'mps{vertica_table_test_name_suffix}',
    'org':  f'org{vertica_table_test_name_suffix}',
    'role': f'role{vertica_table_test_name_suffix}',
    'features': f'features{vertica_table_test_name_suffix}',
    'realm': f'realm{vertica_table_test_name_suffix}',
    'end_customer': f'end_customer{vertica_table_test_name_suffix}'
}
