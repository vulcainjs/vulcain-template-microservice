#!/bin/bash
set -ex

VERSION=${1:?"You must provide a version"}
SERVER=${2:-$VULCAIN_SERVER} # Vulcain server
TOKEN=${3:-$VULCAIN_TOKEN}
TEAM=${4:-${VULCAIN_TEAM:-$(sed -n 's/LABEL.VULCAIN_TEAM=\(.*\)/\1/p' Dockerfile)}}

REGISTRY=${VULCAIN_HUB:-$(sed -n 's/LABEL.VULCAIN_REGISTRY=\(.*\)/\1/p' Dockerfile)}

# Get service information in Dockerfile
SERVICE=${VULCAIN_SERVICE_NAME:-$(sed -n 's/ENV.VULCAIN_SERVICE_NAME=\(.*\)/\1/p' Dockerfile)}
SERVICE_VERSION=${VULCAIN_SERVICE_VERSION:-$(sed -n 's/ENV.VULCAIN_SERVICE_VERSION=\(.*\)/\1/p' Dockerfile)}
IMAGE=$SERVICE:${VERSION}

if [ -n "$TEAM" ]; then
    IMAGE=$TEAM/$IMAGE
fi

if [ -n "$REGISTRY" ]; then
    IMAGE=$REGISTRY/$IMAGE
fi

echo "Building $IMAGE"
docker build -t $IMAGE .

if [ -n "$REGISTRY" ]; then
    echo "Pushing $IMAGE"
    docker push $IMAGE
fi

if [ -n "$SERVER" ]; then
    echo "Notify vulcain at $SERVER"
    cat >data.json <<-EOF
    {
        "schema": "Service",
        "action": "publishVersion",
        "params": {
            "team":"$TEAM",
            "service":"$SERVICE",
            "version":"$SERVICE_VERSION",
            "buildVersion":"${VERSION}"
        }
    }
EOF

    curl -s -H "Authorization: ApiKey $TOKEN" -XPOST http://${SERVER}/api/ \
        -H "Content-Type: application/json" \
        --data '@data.json'
    rm data.json

fi
