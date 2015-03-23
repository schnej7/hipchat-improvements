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
    newDiv.innerHTML = body;
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
    return newDiv;
}

function showUnconfirmedTooltip(obj, messageId) {
    if (obj.className != 'msgTextError messageWrapper') {
        return;
    }
    var html = "<a href='action:resend:"+messageId+"'>This message may not have been sent successfully. Click here to attempt resend.</a>";
	showTooltip(obj, html);
}