import vertica_python
from Vertica import connector as v_conn, constants as vc
from Cassandra import constants as cc

connection_info = v_conn.connectionData()
vertica_tables = vc.vertica_tables

with vertica_python.connect(**connection_info) as connection:
    cursor = connection.cursor()
    for table in vertica_tables:
        print(table, vertica_tables[table])
        with open(f'vert-csv/{table}.csv', "rb") as fs:
            print(f"COPY {vc.vertica_keyspace}.{vertica_tables[table]} FROM STDIN DELIMITER '{cc.cass_csv_delimiter}' ")
            cursor.copy(f"COPY {vc.vertica_keyspace}.{vertica_tables[table]} FROM STDIN DELIMITER '{cc.cass_csv_delimiter}' ",fs)
    v_conn.closeCursor(cursor)
v_conn.closeConnection(connection)

