#!/bin/bash

## Set up env

read -p "Enter your hipchat server url: " HIPCHAT_SERVER

read -p "Enter your mention name: " MENTION_NAME

read -p "Enter your auth token: " AUTH_TOKEN

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
cp build/*js  $HIPCHAT_RES
cp build/*css $HIPCHAT_RES
