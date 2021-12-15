cassandra_host = ['gbq-cass-01']
cassandra_keyspace = 'glassbeam60'
cass_csv_delimiter = '|'
cass_datasource_csv_delimiter = ','
vertica_table_test_name_suffix = ''

customers = ['gdi']

INCLUDE_TEXT = 'INLCUDE'
EXCLUDE_TEXT = 'EXCLUDE'
INCLUDE_ALL = 'ALL'
# keep both exclude_customers & include_customers False or True to include all
exclude_customers = False
include_customers = True

#cassandra_tables = ['dashboards']
cassandra_tables = ['dashboards', 'dashboard_reports', 'dashboard_tags', 'dashboard_role_access']
