from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt']
MAX_FILE_SIZE_MB = 10

def validate_file_size(value):
    if value.size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationError(f'File size cannot exceed {MAX_FILE_SIZE_MB}MB.')

def validate_image_file(value):
    validate_file_size(value)
    FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS)(value)

def validate_document_file(value):
    validate_file_size(value)
    FileExtensionValidator(allowed_extensions=ALLOWED_DOCUMENT_EXTENSIONS)(value)
