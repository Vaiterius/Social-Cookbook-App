from core.settings.base import *

DEBUG = False

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']


# IMAGE STORING.

# AWS settings.
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_DEFAULT_ACL = None
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

# S3 public media storage.
PUBLIC_MEDIA_LOCATION = 'media'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
DEFAULT_FILE_STORAGE = 'core.storage_backends.PublicMediaStorage'

# S3 private media storage.
PRIVATE_MEDIA_LOCATION = 'private'
PRIVATE_FILE_STORAGE = 'core.storage_backends.PrivateMediaStorage'
