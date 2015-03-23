
window.onerror = function (error, url, line) {
    osxConnector.logJavascriptError_('Line ' + line + ': ' + error);
};

function replaceImageWithRetina(node) {
    var emotes = node.getElementsByTagName('IMG');
    for (var i = 0; i < emotes.length; i++) {
        if (emotes[i].getAttribute('name') == 'emoticon') {
            doReplaceImage(emotes[i]);

            var src = emotes[i].getAttribute('src');
            var title = emotes[i].getAttribute('title');
            if (src && title
                 && src.match(/\/img\/emoticons\/scumbag/)
                 && title.match(/\(scumbag\)/)
                 && emotes[i + 1]
                 && emotes[i].nextSibling === emotes[i + 1]) {
                this.scumbagify(emotes[i], emotes[i + 1]);
            }
        }
    }
}

function doReplaceImage(img) {
    var src = img.getAttribute('src'),
    ext = src.split('.').pop(),
    resolution = window.devicePixelRatio;
    if (resolution && resolution > 1) {
        var image = new Image();
        image.onload = function () {
            img.src = src.replace('.' + ext, '@' + resolution + 'x.' + ext);
        };
        image.src = src.replace('.' + ext, '@' + resolution + 'x.' + ext);
    }

}

document.addEventListener('load', function(e) {
    if( e.target.tagName == 'IMG' && window.pinned) {
         unpin();
    }
}, true);

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function scumbagify(hat, scumbag) {
    setTimeout(function() {
               var width = parseInt(scumbag.getAttribute('width'));
               hat.parentNode.style.position = 'relative';
               hat.style.position = 'absolute';
               hat.style.zIndex = '1';
               hat.style.top = scumbag.offsetTop - 3 + 'px';
               hat.style.left = scumbag.offsetLeft + width/2 - 10 + 'px';
               }, 100);
};

function addAnchor(anchorName) {
    var newAnchor = document.createElement('a');
    newAnchor.name = anchorName;
    newAnchor.id = anchorName;
    newAnchor.className = 'scrollAnchor';
    var chatText = document.getElementById('chat_text');
    chatText.insertBefore(newAnchor, chatText.firstChild);
}

function addChatDivider() {
    removeChatDivider();
    var newDiv = document.createElement('div');
    newDiv.className = 'chatDivider';
    document.getElementById('chat_text').appendChild(newDiv);
}

function addChatLine(blockId, className, body, messageId) {
    var currentBlock = document.getElementById(blockId);
    if (!currentBlock || typeof currentBlock == 'undefined') {
        return;
    }
    var newLine = document.createElement('p');
    newLine.id = messageId;
    newLine.className = className;
    newLine.innerHTML = body;
    addLinkHandlers(newLine);
    currentBlock.appendChild(newLine);
    replaceImageWithRetina(newLine);
}

function addChatStateMessage(name) {
    var stateMessage = document.getElementById('chat_state');
    stateMessage.innerHTML = '<p>' + name + ' is typing...</p>';
    stateMessage.style.display = 'block';
}

function addDateDivider(dateString, insertOnTop) {
    var newDiv = document.createElement('div');
    newDiv.className = 'dateDivider';
    newDiv.innerHTML = '<span>'+dateString+'</span>';
    chatText = document.getElementById('chat_text');
    if (insertOnTop) {
        chatText.insertBefore(newDiv, chatText.firstChild);
    } else {
        chatText.appendChild(newDiv);
    }
}

function addLinkHandlers(node) {
    var links = node.getElementsByTagName('A');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.name == 'toggle_paste') {
            link.addEventListener('click', handleTogglePasteClick, false);
        }
    }
}

function addPreviewData(messageId, html, className, displayName) {
    if (typeof displayName == 'undefined') {
        displayName = '&nbsp;';
    }
    var previewNode = document.createElement('div');
    var messageNode = document.getElementById(messageId);
    if (!messageNode || typeof messageNode == 'undefined') {
        return;
    }
    previewNode.className = (className ? className + ' preview' : 'preview');
    previewNode.innerHTML = '<table width="100%" cellspacing="0"><tr><td class="nameBlock"><p>'+displayName+'</p></td><td class="messageBlock">'+html+'</td></tr></table>';
    var links = previewNode.getElementsByTagName('A');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.name == 'toggle_paste') {
            link.addEventListener('click', handleTogglePasteClick, false);
        }
    }
    var node = messageNode;
    while (node != null) {
        if (node.className.indexOf('chatBlock') >= 0) {
            // Don't add the className to the chatBlock anymore
            // since the preview block is a sibling instead of a child
//            if (className) {
//                node.className += ' ' + className;
//            }
            break;
        }
        node = node.parentNode;
    }
    node.parentNode.insertBefore(previewNode, node.nextSibling);
}

function clearChat() {
    var chatText = document.getElementById('chat_text');
    chatText.innerHTML = '';
}

function doScroll() {
    window.scrollTo(0, document.body.scrollHeight);
}

function getMessageForBlock(blockId) {
    var blockNode = document.getElementById(blockId);
    if (!currentBlock) {
        return '';
    } else {
        return currentBlock.lastChild.innerHTML;
    }
}

function getSelectedHTML() {
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var container = document.createElement('div');
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        return container.innerHTML;
    } else {
        return '';
    }
}

function handleBodyClick() {
    var sel = getSelectedHTML();
    window.osxConnector.chatBodyClicked_(sel);
}

function handleTogglePasteClick() {
    var element = this.parentNode.parentNode.getElementsByTagName('div')[0];
    if (element.className.indexOf('untruncated') < 0) {
        element.className = element.className.replace('truncated', 'untruncated');
        this.innerHTML = 'Show less';
    } else {
        element.className = element.className.replace('untruncated', 'truncated');
        this.innerHTML = 'Show more';
    }
}

function hideChatStateMessage() {
    var stateMessage = document.getElementById('chat_state');
    stateMessage.style.display = 'none';
}

function lastChatNodeContainsMessage(msg) {
    var chatText = document.getElementById('chat_text');
    if (chatText.childNodes.length > 0) {
        var lastMessage = chatText.childNodes[chatText.childNodes.length - 1].childNodes[0].innerHTML;
        return lastMessage.indexOf(msg) != -1;
    }
    return false;
}

function markMessageConfirmed(messageId) {
    var messageNode = document.getElementById(messageId);
    if (!messageNode || typeof messageNode == 'undefined') {
        return;
    }
    messageNode.className = 'msgText messageWrapper';
}

function removeChatDivider() {
    var dividerNodes = document.getElementsByClassName('chatDivider');
    for (var i = 0; i < dividerNodes.length; i++) {
        dividerNodes[i].parentNode.removeChild(dividerNodes[i]);
    }
}

function removeLastPresence(bareJid) {
    var presName = 'presence_' + bareJid;
    var chatText = document.getElementById('chat_text');
    for (var i = chatText.childNodes.length - 1; i > 0; i--) {
        var node = chatText.childNodes[i];
        if (node.nodeType != Node.ELEMENT_NODE) {
            return false;
        }
        var name = node.getAttribute('name');
        if (!(/presence_/.test(name))) {
            return false;
        }

        if (name == presName) {
            chatText.removeChild(chatText.childNodes[i]);
            return true;
        }
    }
}

function replaceMessageById(messageId, html) {
    var messageNode = document.getElementById(messageId);
    if (!messageNode || typeof messageNode == 'undefined') {
        return;
    } else {
        messageNode.innerHTML = html;
    }
}

function scrollByPixels(numPixels) {
    setTimeout(function () {
        window.scrollTo(0, window.pageYOffset + numPixels);
    }, 100);
}

function scrollAtBottom() {
    return window.pageYOffset >= (document.body.scrollHeight - window.innerHeight - 200);
}

function scrollToBottom() {
    setTimeout(function () {
        doScroll();
    }, 200);
}

function pinToBottom() {
    window.pinned = true;
    var chat = document.getElementById('chat_text');
    if (chat && chat.style) {
        chat.style.position = 'absolute';
        chat.style.bottom = '0';
    }
}

var unpin = debounce(unpinFromBottom, 300, false);

function unpinFromBottom() {
    var chat = document.getElementById('chat_text');
    if (chat && chat.style) {
        chat.style.position = 'relative';
        chat.style.bottom = '';
        doScroll();
        window.pinned = false;
    }
}

function showHistory() {
    var historyNodes = document.getElementsByClassName('previousHistory');
    for (var i = 0; i < historyNodes.length; i++) {
        historyNodes[i].style.display = 'block';
    }
}

function showMentionTooltip(node) {
    node.title = window.osxConnector.getNameForMention_(node.innerHTML);
}

function showTooltip(obj, html) {
    var tt = document.getElementById('tooltip');
    var curleft = curtop = 0;
    do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    tt.style.top = curtop - 25;
    tt.style.left = curleft;
    tt.style.display = 'block';
    setTimeout(function () {
        tt.style.display = 'none';
    }, 4000);
    tt.innerHTML = html
}

function toggleImage(link) {
    var blockNode = (link.className == 'hide' ? link.parentNode : link.parentNode.parentNode.parentNode);
    var image = blockNode.getElementsByClassName('thumbnail')[0];
    var hiddenText = blockNode.getElementsByClassName('hiddenImage')[0];
    var toggleImg = blockNode.getElementsByClassName('hide')[0].getElementsByTagName('img')[0];
    image.style.display = (image.style.display == 'none' ? '' : 'none');
    hiddenText.style.display = (image.style.display == 'none' ? '' : 'none');
    toggleImg.src = (image.style.display == 'none' ?
        imagePreviewClosed :
        imagePreviewOpened);
}

function updateStyles(type, text) {
    var targetElementId = "";
    if (type == "generic") {
        targetElementId = "generic-styles";
    } else if(type == "device") {
        targetElementId = "device-styles";
    } else {
        return;
    }
    
    var targetElement = document.getElementById(targetElementId);
    targetElement.innerHTML = text;
}

function updateDensity(density) {
    var styleText = "";
    
    if (density == "min") {
        styleText = "p, div, .nameBlock p, .messageBlock p, .messageBlock div, .messageBlock pre { line-height: 103% }";
    } else if (density == "max") {
        styleText = "p, div, .nameBlock p, .messageBlock p, .messageBlock div, .messageBlock pre { line-height: 183% }";
    }

    var overrideElement = document.getElementById('override-styles');
    overrideElement.innerHTML = styleText;
}

