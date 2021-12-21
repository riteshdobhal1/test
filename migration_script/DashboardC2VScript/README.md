# DashboardC2VScript

PRE-REQUISITE TO BE INSTALLED USING COMMANDS BELOW

1. sudo yum install python3-pip -y
2. sudo pip3 install cassandra-driver
3. sudo pip3 install vertica_python

Commands below for data migration
 
1. Read Cassandra data and store it in "/DashboardC2VScript/vert-csv/" path. Here is the command to execute reader
python3 -m Cassandra.reader
2. Map json data to dashboard_datasources csv file
python3 -m datasource_json_reader 
2. Create schema. Here is the command to create schema
python3 -m Vertica.table_schema_creator
3. Copy csv data to Vertica. Here is the command
python3 -m Vertica.writer
