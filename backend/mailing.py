import os 
from dotenv import load_dotenv
from flask_mail import Message
from app import mail

load_dotenv()

# Find the absolute file path to the top level project backend directory
basedir = os.path.abspath(os.path.dirname(__file__))


class Mailing:

    """Used for sending mails. This will mostly be used for two factor authenticated related stuff."""

    MAIL_DEFAULT_SENDER = os.getenv('MAIL_USERNAME', default='')

    @classmethod
    def send_mail(cls, message_data: dict):
        message = Message(
            subject=message_data['subject'],
            recipients=[message_data['recipient']],
            html=message_data['html'],
            sender=("FastBox", cls.MAIL_DEFAULT_SENDER)
        )

        
        mail.send(message)




        

