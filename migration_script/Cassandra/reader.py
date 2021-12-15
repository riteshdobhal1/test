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

def getCassandraRows(session, table_name):
    return session.execute(f'SELECT * from dashboards')

def dumpVertCsvDashboards(rows, table):
    print(table)
    with open(f'vert-csv/{table}.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        incExcAll = includeExclude()
        print(incExcAll)
        d_id_list = []
        for row in rows:
            new_row = {}
            if row.d_id not in d_id_list:
                d_id_list.append(row.d_id)
                new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
                new_row['d_id'] = row.d_id
                new_row['admin_dashboard'] = row.admin_dashboard
                new_row['clinsight_enabled'] = row.clinsight_enabled
                new_row['created_by'] = row.created_by
                new_row['created_ts'] = row.created_ts
                new_row['group_type'] = row.group_type
                new_row['d_link'] = row.d_link
                new_row['ddesc'] = row.ddesc
                new_row['dname'] = row.dname
                new_row['is_public'] = row.is_public
                new_row['modified_ts'] = row.modified_ts
                new_row['owner'] = row.owner
                new_row['site_id'] = row.site_id
                new_row['tableau_wb_name'] = row.tableau_wb_name
                new_row['typ'] = row.type
                new_row['show_tabs'] = False
                print(new_row)
                if incExcAll is cc.EXCLUDE_TEXT:
                    if row.mfr is not '' or row.mfr is not None:
                        if row.mfr not in cc.customers:
                            csv_file.writerow(new_row.values())
                elif incExcAll is cc.INCLUDE_TEXT:
                    if row.mfr is not '' or row.mfr is not None:
                        if row.mfr in cc.customers:
                            csv_file.writerow(new_row.values())
                else:
                    csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvReports(rows, table):
    print(table)
    with open(f'vert-csv/dashboard_reports.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        incExcAll = includeExclude()
        print(incExcAll)
        for row in rows:
            new_row = {}
            scheduler_freq_type = None
            scheduler_freq_value = None
            if row.scheduler_freq is not None:
                if row.scheduler_period == 'monthly':
                    scheduler_freq_type = "-".join(list(row.scheduler_freq.items())[0])
                    scheduler_freq_value = "-".join(list(row.scheduler_freq.items())[1])
                else:
                    scheduler_freq_type = list(row.scheduler_freq.items())[0][0]
                    scheduler_freq_value = list(row.scheduler_freq.items())[0][1]
            new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
            new_row['d_id'] = row.d_id
            new_row['r_id'] = row.r_id
            new_row['chart_height'] = row.chart_height
            new_row['chart_type'] = row.chart_type
            new_row['chart_width'] = row.chart_width
            new_row['content_sheet_url'] = row.content_sheet_url
            new_row['d_type'] = row.d_type
            new_row['export_format'] = row.export_format
            new_row['is_tableau_report'] = row.is_tableau_report
            new_row['r_link'] = row.r_link
            new_row['r_link_csv'] = row.r_link_csv
            new_row['r_link_pdf'] = row.r_link_pdf
            new_row['r_link_xls'] = row.r_link_xls
            new_row['rdesc'] = row.rdesc
            new_row['rname'] = row.rname
            new_row['scheduler_enabled'] = row.scheduler_enabled
            new_row['scheduler_freq_type'] = scheduler_freq_type
            new_row['scheduler_freq_value'] = scheduler_freq_value
            new_row['scheduler_period'] = row.scheduler_period
            new_row['scheduler_recipients'] = row.scheduler_recipients
            new_row['scheduler_time'] = row.scheduler_time
            new_row['scheduler_timezone'] = row.scheduler_timezone
            new_row['scope_name'] = row.scope_name
            new_row['scope_value'] = row.scope_value
            new_row['supported_export_format'] = row.supported_export_format
            new_row['wb_sheet_name'] = row.wb_sheet_name
            new_row['x_offset'] = row.x_offset
            new_row['y_offset'] = row.y_offset
            print(new_row)
            if incExcAll is cc.EXCLUDE_TEXT:
                if row.mfr is not '' or row.mfr is not None:
                    if row.mfr not in cc.customers:
                        csv_file.writerow(new_row.values())
            elif incExcAll is cc.INCLUDE_TEXT:
                if row.mfr is not '' or row.mfr is not None:
                    if row.mfr in cc.customers:
                        csv_file.writerow(new_row.values())
            else:
                csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvTags(rows, table):
    print(table)
    with open(f'vert-csv/dashboard_tags.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        incExcAll = includeExclude()
        print(incExcAll)
        for row in rows:
            new_row = {}
            if row.tag is not None:
                for tag_name in row.tag:
                    new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
                    new_row['d_id'] = row.d_id
                    new_row['tag'] = tag_name.strip()
                    print(new_row)
                    if incExcAll is cc.EXCLUDE_TEXT:
                        if row.mfr is not '' or row.mfr is not None:
                            if row.mfr not in cc.customers:
                                csv_file.writerow(new_row.values())
                    elif incExcAll is cc.INCLUDE_TEXT:
                        if row.mfr is not '' or row.mfr is not None:
                            if row.mfr in cc.customers:
                                csv_file.writerow(new_row.values())
                    else:
                        csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsvRoleAccess(rows, table):
    print(table)
    with open(f'vert-csv/dashboard_role_access.csv', 'w') as outfile:
        csv_file = csv.writer(outfile, dialect='myDialect')
        incExcAll = includeExclude()
        print(incExcAll)
        for row in rows:
            new_row = {}
            if row.role_access is not None:
                for role_name in row.role_access:
                    new_row['mps'] = f'{row.mfr}/{row.prod}/{row.sch}'
                    new_row['d_id'] = row.d_id
                    new_row['role_access'] = role_name.strip()
                    print(new_row)
                    if incExcAll is cc.EXCLUDE_TEXT:
                        if row.mfr is not '' or row.mfr is not None:
                            if row.mfr not in cc.customers:
                                csv_file.writerow(new_row.values())
                    elif incExcAll is cc.INCLUDE_TEXT:
                        if row.mfr is not '' or row.mfr is not None:
                            if row.mfr in cc.customers:
                                csv_file.writerow(new_row.values())
                    else:
                        csv_file.writerow(new_row.values())
        outfile.close()

def dumpVertCsv(rows, fileName):
    if fileName == 'dashboards':
        dumpVertCsvDashboards(rows, fileName)
    elif fileName == 'dashboard_reports':
        dumpVertCsvReports(rows, fileName)
    elif fileName == 'dashboard_tags':
        dumpVertCsvTags(rows, fileName)
    else:
        dumpVertCsvRoleAccess(rows, fileName)
        
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
        print("if block")
        print(tableData)
        dumpVertCsv(tableData, table)
else:
    for table in cc.cassandra_tables:
        tableData = getCassandraRows(session, table)
        print("else block")
        print(tableData)
        dumpVertCsv(tableData, table)
