from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"  # Replace with your actual API key
)

conversation_history = []
MAX_HISTORY = 10

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("input")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    conversation_history.append({"role": "user", "content": user_input})
    if len(conversation_history) > MAX_HISTORY:
        conversation_history.pop(0)

    try:
        completion = client.chat.completions.create(
            model="meta/llama-3.3-70b-instruct",
            messages=conversation_history,
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=False
        )
        
        response_text = completion.choices[0].message.content.strip()

        # **Ensure code formatting in responses**
        if "```" in response_text:
            response_text = response_text.replace("```", "<pre><code>") + "</code></pre>"

        conversation_history.append({"role": "assistant", "content": response_text})
        if len(conversation_history) > MAX_HISTORY:
            conversation_history.pop(0)

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)





    