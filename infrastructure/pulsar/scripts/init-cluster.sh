#!/usr/bin/env bash
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

set -x

ZNODE="/initialized-$clusterName"

bin/watch-znode.py -z $zkServers -p / -w

bin/watch-znode.py -z $zkServers -p $ZNODE -e
if [ $? != 0 ]; then
    echo Initializing cluster
    bin/apply-config-from-env.py conf/bookkeeper.conf &&
        bin/pulsar initialize-cluster-metadata --cluster $clusterName --zookeeper $zkServers \
                   --configuration-store $configurationStore --web-service-url http://192.168.0.131:8010/ \
                   --broker-service-url pulsar://192.168.0.131:6651/ &&
        bin/watch-znode.py -z $zkServers -p $ZNODE -c
    echo Initialized
else
    echo Already Initialized
fi