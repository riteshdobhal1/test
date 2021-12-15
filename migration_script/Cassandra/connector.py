from cassandra.cluster import Cluster
from Cassandra import constants

def createCluster():
    cluster = Cluster(
        contact_points = constants.cassandra_host
    )
    return cluster

def createSession(cluster, keyspace):
    session = cluster.connect(keyspace)
    return session