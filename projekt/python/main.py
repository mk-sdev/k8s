import os
from flask import Flask, jsonify, request
import random
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# 📦 pobranie zmiennych środowiskowych z K8s
db_url = os.environ.get("DB_URL")
username = os.environ.get("USER_NAME")
password = os.environ.get("USER_PWD")

# 🔌 budowanie connection stringa
mongo_uri = f"mongodb://{username}:{password}@{db_url}"

client = MongoClient(mongo_uri)
db = client["testdb"]
collection = db["numbers"]

@app.route("/api/random")
def random_number():
    num = random.randint(1, 100)
    return jsonify({"number": num})

@app.route("/api/save", methods=["POST"])
def save_number():
    data = request.json
    number = data.get("number")

    collection.insert_one({"number": number})

    return jsonify({"status": "saved", "number": number})

@app.route("/api/history")
def get_history():
    items = list(collection.find({}, {"_id": 0}))
    return jsonify(items)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) # port musi odpowiadać teragetPort w serwisie