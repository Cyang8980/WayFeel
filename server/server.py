# importing Flask and jsonify from the flask package
from flask import Flask, jsonify
from flask_cors import CORS
# app instance

app = Flask(__name__)
CORS(app)
@app.route("/api/home", methods = ['GET'])

def return_home():
    return jsonify({
        'message': "Did you log your sadness yet?"
    })

if __name__ == "__main__":
    app.run()