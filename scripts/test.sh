#!/bin/bash

function doTest {
    status=$1
    method=$2
    path=$3
    body=$4
    cookie=$5

    RESPONSE=$( \
        curl \
            -s \
            -o /dev/null \
            -w "%{http_code}" \
            -X $2 "$HOSTNAME$path" \
            -H "Content-Type: application/json" \
            -H "cookie: $cookie;" \
            -d "$body" \
    )

    # Check the response status code
    if [ "$RESPONSE" -eq $status ]; then
        echo "✅ | $RESPONSE | $HOSTNAME$path"
    else
        echo "❌ | $RESPONSE | $HOSTNAME$path"
    fi
}

HOSTNAME="http://localhost:5121"
COOKIE="psexcercise=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiMzQ2M2ZlN2UtMWVjMi00ZjY4LTk5ZTYtNzE4ZWU5MGEzZjc4IiwiZXhwIjoxNzI3NjQ3NjE0LCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.RETU2tlzDWENiLUxCzejZqMhzrc-NMSxMnN6FupHy60"
PREFIX=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 20; echo)

doTest 405 "GET"  "/User/SignOut" ""
doTest 200 "POST" "/User/SignOut" "" $COOKIE
doTest 200 "POST" "/User/SignOut" "" $COOKIE

doTest 405 "GET"  "/User/SignIn" "{ \"email\": \"fake@email.com\", \"password\": \"pass\" }" ""
doTest 401 "POST" "/User/SignIn" "{ \"email\": \"fake@email.com\", \"password\": \"pass\" }" ""
doTest 200 "POST" "/User/SignIn" "{ \"email\": \"user1@email.com\", \"password\": \"pass\" }" ""

doTest 405 "GET"  "/User/SignUp" "{ \"email\": \"$PREFIX@email.com\", \"password\": \"pass\" }" ""
doTest 200 "POST" "/User/SignUp" "{ \"email\": \"$PREFIX@email.com\", \"password\": \"pass\" }" ""
doTest 409 "POST" "/User/SignUp" "{ \"email\": \"$PREFIX@email.com\", \"password\": \"pass\" }" ""

doTest 200 "GET" "/User/GetLoggedUser" ""
doTest 200 "GET" "/User/GetLoggedUser" "" $COOKIE

doTest 401 "GET" "/Task/GetAll"
doTest 200 "GET" "/Task/GetAll" "" $COOKIE
