#!/bin/bash

set -xe

lein with-profile release do clean, cljsbuild once option
rm -rf resources/release/option/js/out

cd resources/release
zip -x *.DS_Store -r ~/firefox_history_master_`date +%s`.zip *
