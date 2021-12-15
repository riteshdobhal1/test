import vertica_python
from Vertica import constants

def connectionData():
    connection_info = {
        'host': constants.vertica_host,
        'port': constants.vertica_port,
        'user': constants.vertica_user,
        'password': constants.vertica_password,
        'database': constants.vertica_database
    }
    return connection_info

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

def verticaSelectQuery(q):
    connection_info = connectionData()
    print(f'executing query inside vertica select query block... : {q}')
    with vertica_python.connect(**connection_info) as connection:
        cursor = connection.cursor()
        user_query = (q)
        print(user_query)
        cursor.execute(user_query)
        rows = []
        for row in cursor.iterate():
            rows.append(row)
        closeCursor(cursor)
        closeConnection(connection)
    return rows

