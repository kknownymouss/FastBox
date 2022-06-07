from Crypto.Random import get_random_bytes
from base64 import b64encode
import os 
from dotenv import load_dotenv

# loading enviroment variables
load_dotenv()


class Randomization:
    
    """ a secure cryptographic randomization class used by any part
     of the web app in need of a random entity """

    # class variables
    ACCESS_TOKEN_SIZE: int = 64
    ACTIVITY_TOKEN_SIZE: int = 96
    SHARE_URL_SIZE: int = 96
    BOX_CODE_SIZE: int = 6
    TWO_FACTOR_CODE_SIZE: int = 6
    FILENAME_SIZE: int = 10
    DOMAIN = os.getenv('DOMAIN', default='')
    
    @classmethod
    def access_token(cls) -> str:
        random_bytes: bytes = get_random_bytes(cls.ACCESS_TOKEN_SIZE)
        access_token_b64_string: str = b64encode(random_bytes).decode("utf-8")
        return access_token_b64_string

    @classmethod
    def activity_token(cls) -> str:
        random_bytes: bytes = get_random_bytes(cls.ACTIVITY_TOKEN_SIZE)
        activity_token_b64_string: str = b64encode(random_bytes).decode("utf-8")
        return activity_token_b64_string

    @classmethod
    def share_url(cls) -> str:
        random_bytes: bytes = get_random_bytes(cls.SHARE_URL_SIZE)
        random_b64_string: str = b64encode(random_bytes).decode("utf-8")
        share_url_b64_string: str = random_b64_string.replace("/", "")
        return f"https://{cls.DOMAIN}/share/url/{share_url_b64_string}"

    @classmethod
    def box_code(cls) -> str:
        random_bytes: bytes = get_random_bytes(16)
        random_b64_string: str = "".join(filter(lambda x: x.isalnum(), b64encode(random_bytes).decode("utf-8")))
        box_code: str = random_b64_string[:cls.BOX_CODE_SIZE]
        return box_code
    
    @classmethod
    def two_factor_code(cls) -> str:
        random_bytes: bytes = get_random_bytes(16)
        random_b64_string: str = "".join(filter(lambda x: x.isalnum(), b64encode(random_bytes).decode("utf-8")))
        two_factor_code: str = random_b64_string[:cls.TWO_FACTOR_CODE_SIZE]
        return two_factor_code
    
    @classmethod
    def filename(cls) -> str:
        random_bytes: bytes = get_random_bytes(16)
        random_b64_string: str = "".join(filter(lambda x: x.isalnum(), b64encode(random_bytes).decode("utf-8")))
        filename: str = random_b64_string[:cls.FILENAME_SIZE]
        return filename


    
