import vertica_python
from Vertica import connector as v_conn, constants as vc

connection_info = v_conn.connectionData()

vertica_tables = vc.vertica_schema_tables

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

def dashboardsSchemaQuery(tableName):
    return f"""CREATE TABLE {vc.vertica_keyspace}.{tableName} (
        mps varchar(255),
        d_id varchar(255),
        admin_dashboard boolean,
        clinsight_enabled boolean,
        created_by varchar(255),
        created_ts timestamp,
        group_type varchar(255),
        d_link varchar(255),
        ddesc varchar(1024),
        dname varchar(255),
        is_public boolean,
        modified_ts timestamp,
        owner varchar(255),
        site_id varchar(255),
        tableau_wb_name varchar(255),
        typ varchar(255),
        show_tabs boolean,
        CONSTRAINT pk PRIMARY KEY(mps, d_id) ENABLED
        );"""

def dashboardReportsSchemaQuery(tableName):
    return f"""CREATE TABLE {vc.vertica_keyspace}.{tableName} (
        mps varchar(255),
        d_id varchar(255),
        r_id varchar(255),
        chart_height int,
        chart_type varchar(255),
        chart_width int,
        content_sheet_url varchar(1024),
        d_type varchar(255),
        export_format varchar(255),
        is_tableau_report boolean,
        r_link varchar(255),
        r_link_csv varchar(255),
        r_link_pdf varchar(255),
        r_link_xls varchar(255),
        rdesc varchar(1024),
        rname varchar(255),
        scheduler_enabled boolean,
        scheduler_freq_type varchar(255),
        scheduler_freq_value varchar(255),
        scheduler_period varchar(255),
        scheduler_recipients varchar(255),
        scheduler_time varchar(255),
        scheduler_timezone varchar(255),
        scope_name varchar(255),
        scope_value varchar(255),
        supported_export_format varchar(255),
        wb_sheet_name varchar(255),
        x_offset int,
        y_offset int,
        CONSTRAINT pk PRIMARY KEY(mps, d_id, r_id) ENABLED
        );"""

def dashboardRoleAccessSchemaQuery(tableName):
    return f"""CREATE TABLE {vc.vertica_keyspace}.{tableName} (
        mps varchar(255),
        d_id varchar(255),
        role_access varchar(255)
        );"""

def dashboardTagsSchemaQuery(tableName):
    return f"""CREATE TABLE {vc.vertica_keyspace}.{tableName} (
        mps varchar(255),
        d_id varchar(255),
        tag varchar(255)
        );"""

def dashboardDatasourcesSchemaQuery(tableName):
    return f"""CREATE TABLE {vc.vertica_keyspace}.{tableName} (
        mps varchar(255),
        d_id varchar(255),
        datasource_id varchar(255),
        datasource_name varchar(255)
        );"""

with vertica_python.connect(**connection_info) as connection:
    cursor = connection.cursor()
    for table in vertica_tables:
        if table == 'dashboards':
            cursor.execute(dashboardsSchemaQuery(vertica_tables[table]))
        elif table == 'dashboard_reports':
            cursor.execute(dashboardReportsSchemaQuery(vertica_tables[table]))
        elif table == 'dashboard_role_access':
            cursor.execute(dashboardRoleAccessSchemaQuery(vertica_tables[table]))
        elif table == 'dashboard_tags':
            cursor.execute(dashboardTagsSchemaQuery(vertica_tables[table]))
        elif table == 'dashboard_datasources':
            cursor.execute(dashboardDatasourcesSchemaQuery(vertica_tables[table]))
    closeCursor(cursor)
    closeConnection(connection)
