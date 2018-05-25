#!/bin/bash

set -xe

lein with-profile release clean
rm -rf resources/release/option/js/out
lein with-profile dev clean
zip -x *.DS_Store -r ~/history_master_src_`date +%s`.zip *
