#!/bin/bash
bin/pulsar initialize-cluster-metadata \
  --cluster $clusterName \
  --zookeeper $zkServers \
  --web-service-url http://192.168.0.131:8010/ \
  --configuration-store $configurationStore \
  --broker-service-url pulsar://192.168.0.131:6651 \ > logs/init-metadata.log 2>&1