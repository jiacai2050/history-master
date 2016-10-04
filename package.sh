#!/usr/bin/env bash

cd $(cd `dirname $0`; pwd)

ZIP_FILE="/tmp/advanced-history.zip"
if [[ -f $ZIP_FILE ]];then
    rm $ZIP_FILE
fi
zip  -x *.DS_Store -x *.md -x *sh -r $ZIP_FILE * > /tmp/lll
