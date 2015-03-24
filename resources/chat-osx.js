var token = 'auth_token=XXAUTH_TOKENXX';
var username = "XXUSER_NAMEXX";
var serverUrl = "XXSERVER_URLXX";
var highlights = [];
var allUsers = [];
var allUsersMap = {};

var responses = {};
function httpGet(theUrl, callback)
{
    theUrl = serverUrl + theUrl;
    if (responses[theUrl])
    {
        callback(responses[theUrl]);
        return;
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    responses[theUrl] = JSON.parse(xmlHttp.responseText);
    callback(responses[theUrl]);
}

function findUser( display_name ) {
    return allUsersMap[display_name];
}

function getAllUsers() {
    httpGet('/v2/user?max-results=1000&'+token,
        function(response) {
            allUsers = response.items;
            for( var i = 0; i < response.items.length; i++ ) {
                if ( response.items[i].mention_name == username ) {
                    var myuser = response.items[i];
                    highlights.push(myuser.name.split(" ")[0]);
                }
                allUsersMap[response.items[i].name] = response.items[i];
            }
        }
    );
}

function addAvatars() {
    if (allUsers.length == 0) {
        getAllUsers();
    }

    var nameBlocks = document.getElementsByClassName('nameBlock');
    for( var i = 0; i < nameBlocks.length; i++ ) {
        var nameBlock = nameBlocks[i];
        var avatars = nameBlock.getElementsByClassName('avatar');
        if (avatars.length == 0) {
            var names = nameBlock.getElementsByTagName('p')
            if (names.length > 0 && names[0]) {
                name = names[0].textContent;
                if (name) {
                    var user = findUser(name);
                    if (user) {
                        var mention_name = user.mention_name;
                        httpGet('/v2/user/@'+mention_name+'?'+token,
                        function(response){
                            if (response.photo_url) {
                                nameBlock.innerHTML += '<img class="avatar" src="'+response.photo_url+'"></img>';
                            }
                        });
                    }
                }
            }
        }
    }
}

function markMessageUnconfirmed(messageId) {
    var messageNode = document.getElementById(messageId);
    if (!messageNode || typeof messageNode == 'undefined') {
        return;
    }
    messageNode.addEventListener('mouseover', function () {
        showUnconfirmedTooltip(this, this.id);
    });
    messageNode.className = 'msgTextError messageWrapper';
}

function addChatBlock(body, insertOnTop) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = highlightName(body);
    newDiv = newDiv.firstChild;
    var chatText = document.getElementById('chat_text');
    addLinkHandlers(newDiv);
    if (insertOnTop && chatText.firstChild) {
        newDiv.className += ' previousHistory';
        newDiv.style.display = 'none';
        chatText.insertBefore(newDiv, chatText.firstChild);
    } else {
        chatText.appendChild(newDiv);
    }
    replaceImageWithRetina(newDiv);
    addAvatars();
    return newDiv;
}

function showUnconfirmedTooltip(obj, messageId) {
    if (obj.className != 'msgTextError messageWrapper') {
        return;
    }
    var html = "<a href='action:resend:"+messageId+"'>This message may not have been sent successfully. Click here to attempt resend.</a>";
	showTooltip(obj, html);
}
