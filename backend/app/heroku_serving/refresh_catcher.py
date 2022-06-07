from flask import current_app

# since the refreshing will return route not found, (it will consider the refreshed url a request sent to the backend). In
# fact, this refresh is meant for the react frontend so thats why we will rerender index.html on 404 error.
def refresh_catcher(e):
    return current_app.send_static_file("index.html")