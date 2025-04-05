from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # To allow frontend requests

@app.route('/upload', methods=['POST'])
def upload():
    resume = request.files.get('resume')
    jd = request.form.get('jobDescription')

    if not resume:
        return jsonify({'error': 'No file uploaded'}), 400

    # Mock processing
    return jsonify({
        'ats_score': 78,
        'matched_keywords': ['Python', 'Data Analysis', 'AI'],
        'gemini_feedback': "Your resume looks strong. Consider adding more project-based experience."
    })

if __name__ == '__main__':
    app.run(debug=True)
