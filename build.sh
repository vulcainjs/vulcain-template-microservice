#!/bin/bash
set -e

TEAM=$VULCAIN_TEAM
REGISTRY=$VULCAIN_HUB

# Get service information in Dockerfile
SERVICE=$VULCAIN_SERVICE_NAME
VERSION=$VULCAIN_SERVICE_VERSION
IMAGE=$REGISTRY/$TEAM/$SERVICE:$BUILD_VERSION

echo "Building $IMAGE"
docker build -t $IMAGE .

echo "Pushing $IMAGE"
docker push $IMAGE

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
            "buildVersion":"${BUILD_VERSION}"
        }
    }
    EOF

    curl -s -H "Authorization: ApiKey $VULCAIN_TOKEN" -XPOST http://${VULCAIN_SERVER}/api \
        -H "Content-Type: application/json" \
        --data '@data.json'
    rm data.json
    
fi
