function info (){
    echo "[$APP_ID:$APP_VERSION] $1"
}

function gen() {
  info "generate: '$1'"
  node "./_/$1.js" > "$1"
}

function docker_build() {
  info "docker build: $1"
  docker build -t "${APP_ID}_$1" devops/docker/$1
}
##---------------------
## Utilities
##---------------------
function now (){
  date +"%Y%m%d%H%M%S"
}

function kill_app () {
  file=$1/${2:-}.pid
  if [ -e $file ]
  then
    pid="$(cat $file)"
    rm $file
    if ps -A -o pid | grep $pid &> /dev/null; then
      kill -9 $pid && echo "kill $pid from $file" || echo "can't kill $pid from $file"
    fi
  fi
}

function stopDockerContainer() {
  if [ "$(docker ps -q -f name=$1 -f status=running)" ]; then
    echo "stop docker container $1"
    docker stop $1
  fi
}

function rmDockerContainer() {
  if [ "$(docker ps -q -f name=$1)" ]; then
    stopDockerContainer $1
    echo "remove docker container $1"
    docker rm $1
  fi
}

function dpr {

    rmDockerContainer registry

    docker run -d \
      --restart=always \
      --name registry \
      -v `pwd`/scripts:/certs \
      -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
      -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/cert-chain.crt \
      -e REGISTRY_HTTP_TLS_KEY=/certs/server.key \
      -p 5000:443 \
      registry:2
}

function check_ruby_version {
  echo "Check ruby version"
  ruby_ver="$(cat .ruby-version)"
  if ! ruby -v | grep $ruby_ver &> /dev/null; then
    if ! rbenv versions | grep $ruby_ver &> /dev/null; then
        brew update && brew upgrade ruby-build
        rbenv install $ruby_ver
    fi
    rbenv local $ruby_ver
  fi

}

function version {

  docker version
  ruby -v
  go version
}

function cql {
  docker exec -ti cp_cassandra /opt/cassandra/bin/cqlsh -k $C3_KEYSPACE -e "$1"
}

function help {
 cat README.md
}

function db_value {
  sql="select ${1##*[_[:alnum:]].} from ${1%%.*[_[:alnum:]]} where ${2:-${1##*[_[:alnum:]].} is not NULL};"
  pgsql $sql \
  | head -n 1 \
  | sed -e 's/^[[:space:]]*//' 
}

function pgsql {
  psql -d $CP_POSTGRES_CONNECTION_URL -c "$1" -t
}

function show() {
    echo "\"Svg.$1\":[" >> 'heroic.txt'
    cat "./src/$1.svg"  >> 'heroic.txt'
    echo "],\n" >> 'heroic.txt'
}

function scanFiles() {
    echo "$(pwd)"
    files=($(find -E src -type f -regex ".*\.svg$"))

    for item in ${files[*]}
    do
        file=$(echo $item | sed -E -e 's/src\/(.*)\.svg/\1/g')
        show $file
    done
}
