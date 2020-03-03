#!/bin/bash

LATEST_TAG_NAME=$(git describe --exact-match --tags master)
CURRENT_VERSION=$(python ../run.py --version)

if [ $LATEST_TAG_NAME != $CURRENT_VERSION ]
then
	echo "Tag and current version do not match; tag=${LATEST_TAG_NAME} current=${CURRENT_VERSION}"
	exit 1
else
	echo "Tag and current version do match (${LATEST_TAG_NAME})"
	exit 0
fi
