#!/bin/bash

## Set up env

CAN_CURL=$(which curl)
if [[ !(-z "$CAN_CURL") ]]; then
    CAN_CURL=true
else
    CAN_CURL=false
    echo "WARNING: you do not have 'curl' installed.  The installation process cannot verify your information"
fi

VERIFIED=false
FIRST_PASS=true

## Get and verify the server url
while [[ $VERIFIED != true && $CAN_CURL == true || $FIRST_PASS == true ]]; do

    FIRST_PASS=false

    read -p "Enter your hipchat server url: " HIPCHAT_SERVER

    STATUS=$(curl -s -o /dev/null -I -w "%{http_code}" "$HIPCHAT_SERVER")

    if [[ "$STATUS" == "200" ]]; then
        VERIFIED=true
    else
        echo "Server url is not correct, are you missing 'https://' ?"
        echo "Try again"
    fi
done

VERIFIED=false
FIRST_PASS=true

## Get and verify the server url
while [[ $VERIFIED != true && $CAN_CURL == true || $FIRST_PASS == true ]]; do

    FIRST_PASS=false

    read -p "Enter your auth token: " AUTH_TOKEN

    STATUS=$(curl -s -o /dev/null -I -w "%{http_code}" "$HIPCHAT_SERVER/v2/user?auth_token=$AUTH_TOKEN")

    if [[ "$STATUS" == "200" ]]; then
        VERIFIED=true
    else
        echo "The auth token you have entered did not provide access to $HIPCHAT_SERVER"
        echo "Try again"
    fi
done

VERIFIED=false
FIRST_PASS=true

## Get and verify the server url
while [[ $VERIFIED != true && $CAN_CURL == true || $FIRST_PASS == true ]]; do

    FIRST_PASS=false

    read -p "Enter your mention name: " MENTION_NAME

    STATUS=$(curl -s -o /dev/null -I -w "%{http_code}" "$HIPCHAT_SERVER/v2/user/@$MENTION_NAME?auth_token=$AUTH_TOKEN")

    if [[ "$STATUS" == "200" ]]; then
        VERIFIED=true
    else
        echo "Could not get user $MENTION_NAME, please do not include the @ symbol"
        echo "Try again"
    fi
done



if [[ -z "$HIPCHAT_HOME" ]]; then
    HIPCHAT_HOME=/Applications/HipChat.app/
fi

HIPCHAT_RES=$HIPCHAT_HOME/Contents/Resources/

## Build
rm -rf build
mkdir build
cp resources/*js  build
cp resources/*css build
REGEX=s/XXUSER_NAMEXX/$MENTION_NAME/g
sed -i.bak "$REGEX" build/chat-osx.js
REGEX=s/XXAUTH_TOKENXX/$AUTH_TOKEN/g
sed -i.bak "$REGEX" build/chat-osx.js
REGEX=s#XXSERVER_URLXX#$HIPCHAT_SERVER#g
sed -i.bak "$REGEX" build/chat-osx.js

## Copy files to where hipchat expects them
cp build/*js  "$HIPCHAT_RES"
cp build/*css "$HIPCHAT_RES"
