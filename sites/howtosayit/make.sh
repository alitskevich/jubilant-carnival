APP_META_URL="https://script.google.com/macros/s/AKfycbw4xNoL9WKm9z5rMw0qoCFdo1KhbDU1bmdZI12uKFmul1S-4AgvGZMmsXPPJ2H4eA1f/exec"

function fetch() {
    curl -L "$APP_META_URL?action=items" > quiz.json
}

function make() {
    full=$(find meta.js -newer package.json)
    if [ -n "$full" ]; then
        files=($(find -E . -type f -regex ".*js$"))
        echo "full make"
    else
        files=($(find -E . -type f -regex ".*js$" -newer package.json))
    fi
    for item in ${files[*]}
    do
        file=$(echo $item | sed -E -e 's/\.\/src\/(.*)\.js/\1/g')
        genOne $file
    done
    touch package.json
}

eval ${1:-make}