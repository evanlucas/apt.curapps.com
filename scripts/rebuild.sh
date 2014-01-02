#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR"/..

./dpkg-scanpackages -m debs /dev/null | gzip -9c > Packages.gz
