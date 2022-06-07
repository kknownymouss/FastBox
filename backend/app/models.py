from datetime import datetime, timedelta
from app import db

# the Box model
class Box(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)
    code = db.Column(db.String(300), unique=True, nullable=False)
    password = db.Column(db.LargeBinary, nullable=False, unique=False)
    restrict_access = db.Column(db.Boolean, nullable=True)
    access_tokens = db.relationship("AccessToken", backref="box", lazy=True)
    activity_tokens = db.relationship("ActivityToken", backref="box", lazy=True)
    share_urls = db.relationship("Share", backref="box", lazy=True)
    share_url_qrcode = db.relationship("Share_qrcode", backref="box", lazy=True, )
    absolute_children = db.relationship('Folder_file', backref="absolute_parent_box", lazy=True)
    two_factor_auth = db.Column(db.Boolean, nullable=True, default=False)
    two_factor_email = db.Column(db.String(300), unique=False, nullable=True)
    two_factor_code = db.Column(db.String(6), nullable=True)
    qrcode = db.Column(db.String(500), nullable=True)
    qrcode_public_id = db.Column(db.String(500), nullable=True)

# access token model
class AccessToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    box_id = db.Column(db.Integer, db.ForeignKey('box.id'),
        nullable=False)
    expiry = db.Column(db.DateTime, nullable=True)

class ActivityToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    full_access = db.Column(db.Boolean, nullable=False)
    box_id = db.Column(db.Integer, db.ForeignKey('box.id'),
        nullable=False)
    expiry = db.Column(db.DateTime, nullable=True)

class Folder_file(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), unique=False, nullable=False)

    parent_folder_id = db.Column(db.Integer, db.ForeignKey('folder_file.id'),
        nullable=True)
    public_id = db.Column(db.String(500), unique=True, nullable=True)
    parent_folder = db.relationship("Folder_file", backref="children_folders", remote_side=id)
    # sqlalchemy approach : children = db.relationship('Folder',  backref=db.backref('parent', remote_side='Folder.id'))
    # remote side means "parent_folder is present in child, local side means its present in parent"

    absolute_box_id = db.Column(db.Integer, db.ForeignKey('box.id'),
        nullable=False)
    type = db.Column(db.String(300), nullable=False)
    main = db.Column(db.Boolean, nullable=False, default=False)
    file_url = db.Column(db.String(500), nullable=True)
    size = db.Column(db.Integer, nullable=True)
    date_created = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)




class Share(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), unique=True, nullable=False)
    box_id = db.Column(db.Integer, db.ForeignKey('box.id'),
        nullable=False)


class Share_qrcode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), unique=True, nullable=False)
    box_id = db.Column(db.Integer, db.ForeignKey('box.id'),
        nullable=False)


