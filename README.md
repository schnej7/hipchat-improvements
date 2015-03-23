# Hipchat Improvements

Includes:
* Hilighting your name
* Font improvements
* Avatars

## How to generate an Auth Token

This will be needed for later steps in the installation process

Visit:
```
<YOUR-HIPCHAT-SERVER>/account/api
```

## Installation

### Step 1

Download this repo

If you have git installed:
```
git clone https://github.com/schnej7/hipchat-modifications.git
```

From a direct link:
https://github.com/schnej7/hipchat-modifications/archive/master.zip

(make sure to unzip the file once it has downloaded)

### Step 2

From a terminal, cd to where you downloaded the repo

If you direct downloaded:
```
cd ~/Downloads/hipchat-modifications-master
```

### Step 3

Set your HIPCHAT_HOME enviornment variable:

It is probably located at `/Applications/HipChat.app/`
```
export HIPCHAT_HOME=/Applications/HipChat.app/
```

### Step 4

run `./install.sh`

You will be prompted to enter your hipchat server url, your mention name, and your auth token

### Step 5

Restart hipchat
