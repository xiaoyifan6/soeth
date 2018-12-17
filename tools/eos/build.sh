#!/bin/bash

start_time=$(date +%s)

curpath=$(cd "$(dirname "$0")"; pwd)
cd "$curpath/../../"

# 账号 
flag_reset="0"
flag_buy_ram="0"
flag_buy_cpu="0"
flag_init="0"

account="" # 金主
new_account="" # 合约名称 新账号
contract_name=""

wallet="" # 钱包名称
money="0" # 部署钱包需要的金额
cpu_money="0" # 部署钱包需要的金额
net_money="0" # 网络资源
git_url="" # git地址
private_key="" # 私钥
public_key="" # 公钥
contract_path="" # 合约相对路径
password="" #密码
url=""

# :a:c:C:g:k:K:n:p:P:r:R:w:
# a: 金主账号
# c: 购买cpu
# C: 合约名称
# g: git地址
# k: 私钥
# K: 公钥
# n: 新账号
# N: 购买网路资源
# i: 初始化
# p: 合约相对路径
# P: 钱包密码
# r: 购买ram
# R: 重置
# w: 钱包名称
# u: url 测试网地址

while getopts :a:c:C:g:ik:K:n:N:p:P:r:Ru:w: OPTION;do
    case $OPTION in
    a) account=$OPTARG ;;
    c) 
        cpu_money=$OPTARG
        if [ $cpu_money -gt 0 ];then
            flag_buy_cpu="1"
        fi
     ;;
    C) contract_name=$OPTARG ;;
    g) git_url=$OPTARG ;;
    p) contract_path=$OPTARG ;;
    P) password=$OPTARG ;;
    i) flag_init="1" ;;
    k) private_key=$OPTARG ;;
    K) public_key=$OPTARG ;;
    r) 
        money=$OPTARG 
        if [ $money -gt 0 ];then
            flag_buy_ram="1"
        fi
    ;;
    n) new_account=$OPTARG ;;
    N) 
        net_money=$OPTARG
        if [ $net_money -gt 0 ];then
            flag_buy_cpu="1"
        fi    
    ;;
    R) flag_reset="1" ;;
    u) url=$OPTARG ;;
    w) wallet=$OPTARG ;;
    ?) echo "unkow $OPTION: $OPTARG" ;;
    esac
done


home=$HOME # 用户根目录
pwd_file="$wallet.txt"
tmp_file="tmp.txt"
log_file="contract_name.log"

# 清空日志
cat /dev/null > $log_file

# 清除之前的部署
if [ "$flag_reset" = "1" ];then
    docker stop keosd
    docker rm keosd
fi

docker start keosd

if [ "$flag_reset" = "1" ];then
    # 运行
    docker run -d --restart=unless-stopped --name keosd   \
    -v $curpath/eosio-wallet:/opt/eosio/bin/data-dir  \
    -v $curpath/eosio-wallet:$home/eosio-wallet \
    -t eosio/eos /opt/eosio/bin/keosd  \
    --wallet-dir /opt/eosio/bin/data-dir \
    --http-server-address=127.0.0.1:8900
fi

# 设置命令
shopt  -s  expand_aliases
alias cleos="docker exec -i keosd /opt/eosio/bin/cleos  --wallet-url http://127.0.0.1:8900  -u $url"

echo "alias cleos='docker exec -i keosd /opt/eosio/bin/cleos  --wallet-url http://127.0.0.1:8900  -u $url'">> $log_file

if [ "$flag_reset" = "1" ];then
    # 创建钱包 并 导入私钥
    cleos wallet create -n $wallet --to-console > $pwd_file

    cat $pwd_file |grep "\"" |awk -F "\"" '{ print $2 }' > $tmp_file
    cat $tmp_file > $pwd_file
    rm -f $tmp_file
    cleos wallet import -n $wallet $private_key
    # 获取钱包密码
    password=$(cat $pwd_file)
fi

# 打开钱包
cleos wallet open -n $wallet 
echo "cleos wallet open -n $wallet" >> $log_file

# 解锁钱包
cleos wallet unlock -n $wallet --password $password 
echo "cleos wallet unlock -n $wallet --password $password" >> $log_file

# 判断账号是否存在
flag_has_account=$(cleos get accounts $public_key|grep -c "$new_account")
if [ ${#flag_has_account[*]} -eq 0 ];then
    # 创建账号
    echo "create new account"
    cleos system newaccount --stake-net '0.001 EOS' --stake-cpu '0.02 EOS' --buy-ram-kbytes 3 $account $new_account $public_key
    echo "cleos system newaccount --stake-net '0.001 EOS' --stake-cpu '0.02 EOS' --buy-ram-kbytes 3 $account $new_account $public_key">> $log_file
fi

# 购买cpu
if [ "$flag_buy_cpu" = "1" ];then
    echo "buy cpu&net"
    cleos system delegatebw $account $new_account "$net_money EOS" "$cpu_money EOS"
    echo "cleos system delegatebw $account $new_account \"$cpu_money EOS\" \"$cpu_money EOS\"">> $log_file
fi

if [ "$flag_buy_ram" = "1" ];then
    # 购买ram
    echo "buy ram"
    cleos system buyram -k $account $new_account $money
    echo "cleos system buyram -k $account $new_account $money">> $log_file
fi

# 下载合约
echo "get contract files: $curpath/contracts/"
if [ -d "$curpath/contracts/" ];then
    cd $curpath/contracts/$contract_name/
    git pull
    cd "$curpath/../../"
else
    mkdir $curpath/contracts/
    cd $curpath/contracts/
    git clone -b master $git_url
    cd "$curpath/../../"
fi

# 复制合约
doc_id=$(docker inspect -f '{{.ID}}'  keosd)
docker cp $curpath/contracts/$contract_path $doc_id:$home/eosio-wallet/contracts/
echo "copy contract: $doc_id:$home/eosio-wallet/$contract_name"

echo "set constracts: $contract_name - $new_account"

# 设置合约
cleos set contract $new_account $home/eosio-wallet/contracts/$contract_name -p $new_account@active
echo "cleos set contract $new_account $home/eosio-wallet/contracts/$contract_name -p $new_account@active">> $log_file

# 转账
# cleos transfer $account  $new_account  "0.0001 EOS" 'deploy contract'
# echo "cleos transfer $account  $new_account  \"0.0001 EOS\" 'deploy contract'">> $log_file

if [ "$flag_init" = "1" ];then
# 初始化
    current=$(date +%s)
# 授权提现
    cleos set account permission ${new_account} active "{\"threshold\": 1,\"keys\": [{\"key\": \"${public_key}\",\"weight\": 1}],\"accounts\": [{\"permission\":{\"actor\":\"${new_account}\",\"permission\":\"eosio.code\"},\"weight\":1}]}" owner -p ${new_account}
fi

end_time=$(date +%s)
cost_time=$(($end_time - $start_time))
echo "花费时间：${cost_time}s"

