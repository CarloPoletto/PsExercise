#!/bin/bash

function doTest {
    status=$1
    path=$2
    body=$3
    cookie=$4

    RESPONSE=$( \
        curl \
            -s \
            -o /dev/null \
            -w "%{http_code}" \
            -X GET "$HOSTNAME$path" \
            -H "Content-Type: application/json" \
            -H "cookie: $cookie;" \
            -d "$body" \
    )

    # Check the response status code
    if [ "$RESPONSE" -eq $status ]; then
        echo "✅ | $path | Status Code $RESPONSE"
    else
        echo "❌ | $path | Status Code $RESPONSE"
    fi
}

HOSTNAME="http://localhost:5121"
COOKIE="psexcercise=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiMzQ2M2ZlN2UtMWVjMi00ZjY4LTk5ZTYtNzE4ZWU5MGEzZjc4IiwiZXhwIjoxNzI3NjQ3NjE0LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.RETU2tlzDWENiLUxCzejZqMhzrc-NMSxMnN6FupHy60"
PREFIX=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 20; echo)

doTest 401 "/User/SignIn" "{ \"email\": \"fake@email.com\", \"password\": \"pass\" }" ""
doTest 200 "/User/SignIn" "{ \"email\": \"user1@email.com\", \"password\": \"pass\" }" ""

doTest 200 "/User/SignUp" "{ \"email\": \"$PREFIX@email.com\", \"password\": \"pass\" }" ""
doTest 409 "/User/SignUp" "{ \"email\": \"$PREFIX@email.com\", \"password\": \"pass\" }" ""

doTest 401 "/Task/GetAll"
doTest 200 "/Task/GetAll" "" $COOKIE
