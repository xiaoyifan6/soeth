#!/bin/bash



curpath=$(cd "$(dirname "$0")/"; pwd)

outpath="$curpath/../lib/"
buildpath="$curpath/../dist/"
indexpath="$buildpath/index.js"
indextpath="$buildpath/index.d.ts"
resourceconfigpath="$curpath/res.config"

if [ ! -d "$buildpath" ];then
    mkdir $buildpath
    echo $buildpath
fi

cat /dev/null > $indexpath
cat /dev/null > $indextpath

cd $curpath/../

rm -rf $outpath
tsc -p tsconfig.json
bash $curpath/gensort.sh

cd $outpath

# files=$(find . -name "*.js")
files=$(cat $resourceconfigpath|awk '{print $2}')

for file in $files;do
    cat $file>>$indexpath
    cat "${file%.*}.d.ts">>$indextpath
done

uglifyjs $indexpath -m -o $buildpath/index.min.js

rm -rf $outpath
mkdir $outpath
mv  $buildpath/* $outpath

rm -rf $buildpath