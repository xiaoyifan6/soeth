#!/bin/bash

curpath=$(cd "$(dirname "$0")/"; pwd)
outpath="$curpath/../lib/"
resourceconfigpath="$curpath/res.config"

cd $outpath
files=$(find . -name "*.js")

if [ "$1"x = "clear"x ];then
    cat /dev/null > $resourceconfigpath
elif [ ! -f "$resourceconfigpath" ];then
    cat /dev/null > $resourceconfigpath
fi

content=$(cat $resourceconfigpath)

index=$(awk 'END{print NR}' $resourceconfigpath)

for file in $files;do
    result=$(cat $resourceconfigpath | grep "${file}")
    if [[ "$result"x = ""x ]];then
        index=$((index+1));
        echo "add line '$index $file'"
        echo "$index $file" >> $resourceconfigpath
    fi
done

cat $resourceconfigpath|sort -n > "$resourceconfigpath.tmp"
mv "$resourceconfigpath.tmp" "$resourceconfigpath"