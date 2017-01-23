#!/bin/bash
set -ex

TEAM=${VULCAIN_TEAM:-$(sed -n 's/ENV.VULCAIN_TEAM=\(.*\)/\1/p' Dockerfile)}
REGISTRY=${VULCAIN_HUB:-$(sed -n 's/LABEL.VULCAIN_REGISTRY=\(.*\)/\1/p' Dockerfile)}

# Get service information in Dockerfile
SERVICE=${VULCAIN_SERVICE_NAME:-$(sed -n 's/ENV.VULCAIN_SERVICE_NAME=\(.*\)/\1/p' Dockerfile)}
VERSION=${VULCAIN_SERVICE_VERSION:-$(sed -n 's/ENV.VULCAIN_SERVICE_VERSION=\(.*\)/\1/p' Dockerfile)}
IMAGE=$SERVICE:${BUILD_VERSION:-"$VERSION.latest"}

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

if [ -n "$VULCAIN_SERVER" ]; then
    echo "Notify vulcain at $VULCAIN_SERVER"
    cat >data.json <<-EOF
    {
        "schema": "Service",
        "action": "publishVersion",
        "params": {
            "team":"$TEAM",
            "service":"$SERVICE",
            "version":"$VERSION",
            "buildVersion":"${BUILD_VERSION:-"$VERSION.latest"}"
        }
    }
EOF

    curl -s -H "Authorization: ApiKey $VULCAIN_TOKEN" -XPOST http://${VULCAIN_SERVER}/api/ \
        -H "Content-Type: application/json" \
        --data '@data.json'
    rm data.json

fi
