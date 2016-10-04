#!/usr/bin/env bash

cd $(cd `dirname $0`; pwd)

set -x
ZIP_FILE="${HOME}/Desktop/advanced-history.zip"
if [[ -f $ZIP_FILE ]];then
    rm $ZIP_FILE
fi
zip -x *.DS_Store -r $ZIP_FILE manifest.json background.js assets
