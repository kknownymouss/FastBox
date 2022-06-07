from Crypto.Random import get_random_bytes
from base64 import b64encode
from Crypto.Protocol.KDF import bcrypt, bcrypt_check
from Crypto.Hash import SHA256


# hash the password using bcrypt algorithm
def hash_password(pwd: str):
    b_pwd: bytes = bytes(pwd, "utf-8")
    b_salt = get_random_bytes(16)
    b64_sha256_pwd: bytes = b64encode(SHA256.new(b_pwd).digest())
    bcrypt_hash: bytes = bcrypt(b64_sha256_pwd, 12, b_salt)
    return bcrypt_hash

# verifies if the given password bcrypt hash matches the stored bcrypt hash
def verify_hash(pwd: str, bcrypt_hash: bytes):
    b_pwd: bytes = bytes(pwd, "utf-8")
    b64_sha256_pwd: bytes = b64encode(SHA256.new(b_pwd).digest())
    try:
        bcrypt_check(b64_sha256_pwd, bcrypt_hash)  
        return True
    except ValueError:
        return False