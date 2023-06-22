import openai as ai
from flask import Flask, render_template, request, jsonify


app = Flask(__name__)
ai.api_key = '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'

@app.route('/generate', methods=['POST'])
def generate():
    content = request.json.get('content')
    model = "gpt-3.5-turbo"
    response = ai.ChatCompletion.create(
        model=model,
        messages=[{"role": "system", "content": content}]
    )
    return jsonify({'response': response.choices[0].message.content})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
