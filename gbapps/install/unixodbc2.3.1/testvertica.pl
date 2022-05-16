use DBI;
$db='qa0';
$server='localhost';
$port='5433';
$usr='dbadmin';
my $dbh = DBI->connect('dbi:ODBC:driver=Vertica;database='.$db.';server='.$server.';port='.$port.';uid='.$usr, $usr, '', {
'RaiseError' => 1, 'AutoCommit' => 1,
}) or die("$!");

$schema = 'test5';
$dbh->do("create schema $schema");
$dbh->do("create table $schema.tb1(f1 varchar(10))");
$dbh->do("set search_path to $schema");
$dbh->do("insert into $schema.tb1 values('sa')");
$dbh->do("delete from $schema.tb1");
$dbh->do("drop schema $schema cascade");
$dbh->disconnect();



 
