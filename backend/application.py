from app import create_app
import os


# create the initialized and configured app
application = create_app()

if __name__ == "__main__":  
    application.run(host="0.0.0.0", debug=False, port=os.environ.get('PORT', 80))
