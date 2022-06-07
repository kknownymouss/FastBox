from app.heroku_serving import serve_bp
from flask import current_app

# This root endpoint is going to point to the built version of the ReactJS code where we will call the endpoints and show the results in a web browser.
@serve_bp.route('/')
def serve_react():
    return current_app.send_static_file("index.html")

