#!/bin/bash

Images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep '^backend')

for image in $Images; do
    # echo "Removing image: $image"
    docker rmi -f $image
done