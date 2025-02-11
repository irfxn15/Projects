$(document).ready(function () {
    $("#send-button").click(sendMessage);

    $("#user-input").keypress(function (e) {
        if (e.which === 13) {  // Enter key pressed
            sendMessage();
        }
    });

    function sendMessage() {
        let inputField = $("#user-input");
        let userMessage = inputField.val().trim();
        if (!userMessage) return;

        // Append user's message to the chat box.
        appendMessage("user", userMessage);
        inputField.val("");  // Clear input field

        // Show animated typing indicator
        showTypingIndicator();

        // Send message to the backend
        $.ajax({
            url: "/chat",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ input: userMessage }),
            success: function (response) {
                removeTypingIndicator();
                if (response.response) {
                    appendMessage("assistant", response.response);
                } else {
                    appendMessage("assistant", "⚠️ No response from server.");
                }
            },
            error: function (xhr, status, error) {
                removeTypingIndicator();
                appendMessage("assistant", "❌ Error: " + error);
            }
        });
    }

    function appendMessage(role, message, isTyping = false) {
        let chatBox = $("#chat-box");
        let messageDiv = $("<div class='message " + role + "'></div>");
    
        if (isTyping) {
            messageDiv.addClass("typing").text("Typing...");
        }
    
        // Check if response contains a code block and render it properly
        if (message.includes("<pre><code>")) {
            messageDiv.html(message);  // Directly insert formatted HTML
        } else {
            messageDiv.text(message);
        }
    
        chatBox.append(messageDiv);
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }
    

    function showTypingIndicator() {
        let chatBox = $("#chat-box");
        let typingDiv = $("<div>").addClass("message assistant typing")
            .html('<span class="dot"></span><span class="dot"></span><span class="dot"></span>');
        chatBox.append(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        $(".typing").remove();
    }

    function scrollToBottom() {
        let chatBox = $("#chat-box");
        chatBox.scrollTop(chatBox[0].scrollHeight);
    }
});
