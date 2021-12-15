from Cassandra import constants as cc
import glob
import json, csv
csv.register_dialect('myDialect', delimiter=f'{cc.cass_datasource_csv_delimiter}', quoting=csv.QUOTE_NONE, escapechar='\"')
src = "Json/*"
files = glob.glob(src, recursive=False)
with open(f'vert-csv/dashboard_datasources.csv', 'w') as outfile:
    csv_file = csv.writer(outfile, dialect='myDialect')
    for file in files:
        print('\n')
        print(file)
        print('--------------------------------------------------------------------------')
        f = open(file, )
        data = json.load(f)
        f.close()
        rows = data['Data']
        filepath = file.split('/')
        filepathnamelist = filepath[1].split('.')
        mps = "/".join(filepathnamelist[0].split('_'))
        for row in rows:
            new_row = {}
            new_row['mps'] = mps
            new_row['d_id'] = row['d_id']
            for d_row in row['datasource']:
                new_row['datasource_id'] = d_row['id']
                new_row['datasource_name'] = d_row['name']
                print(new_row)
                csv_file.writerow(new_row.values())
    outfile.close()

