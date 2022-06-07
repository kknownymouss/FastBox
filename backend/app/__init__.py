from flask import Flask, request, has_request_context
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from config import DevelopmentConfig, ProductionConfig

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
mail = Mail()


def create_app(config_class=ProductionConfig):
    
    """ Flask application factory pattern """

    app = Flask(
        __name__,
        static_url_path="/",
        static_folder="../../client/build/"
    )

    # configs
    app.config.from_object(config_class)
    configure_logging(app)

    # initializations
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    mail.init_app(app)

    
    
    # blueprint registration (blue prints are imported right before registration to avoid circular imports)
    from app.authorization import authorization_bp
    app.register_blueprint(authorization_bp)

    from app.main.box import main_box_bp
    app.register_blueprint(main_box_bp)

    from app.main.share_url import main_sharing_bp
    app.register_blueprint(main_sharing_bp)

    from app.main.folder_file import main_folder_file_bp
    app.register_blueprint(main_folder_file_bp)

    from app.heroku_serving import serve_bp
    app.register_blueprint(serve_bp)

    # register error handler used for react-flask hosting
    from app.heroku_serving.refresh_catcher import refresh_catcher
    app.register_error_handler(404, refresh_catcher)


    # return the configured and initalized instance of app
    return app


def configure_logging(app):

    import logging
    from flask.logging import default_handler
    from logging.handlers import RotatingFileHandler

    # formatter class
    class RequestFormatter(logging.Formatter):
        def format(self, record):
            if has_request_context():
                record.url = request.url
                record.remote_addr = request.remote_addr
            else:
                record.url = None
                record.remote_addr = None

            return super().format(record)

    # create a file formetter object
    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
        '%(levelname)s: %(message)s [in %(filename)s: %(lineno)d]'
    )

    # Deactivate the default flask logger so that log messages don't get duplicated 
    app.logger.removeHandler(default_handler)

    # Create a file handler object
    file_handler = RotatingFileHandler('flaskapp.log', maxBytes=163000, backupCount=20, delay=True)

    # Set the logging level of the file handler object so that it logs ERROR and up
    file_handler.setLevel(logging.ERROR)

    # Apply the file formatter object to the file handler object
    file_handler.setFormatter(formatter)

    # Add file handler object to the logger
    app.logger.addHandler(file_handler)


# create the database tables
def create_database(db, application):
    db.create_all(app=application)