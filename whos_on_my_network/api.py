from flask import Flask, render_template, request, jsonify


app = Flask(__name__, static_url_path='')


@app.route("/", methods=["GET"], endpoint='home')
def root():
    """ Serve React application to all frontend routes """
    return render_template('index.html')


# Setup access control

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
