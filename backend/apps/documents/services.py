from .models import Document, DocumentVersion

class DocumentService:
    @staticmethod
    def create_new_version(document, new_version, file_obj, user, notes=""):
        """
        Archives the current document state and promotes the new file/version into primary priority.
        """
        # Archive current state
        DocumentVersion.objects.create(
            document=document,
            version_number=document.version,
            file=document.file,
            uploaded_by=document.uploaded_by,
            notes="Archived by automated version bump."
        )

        # Update primary document
        document.file = file_obj
        document.version = new_version
        document.uploaded_by = user
        document.save()
        
        # Log the new state in history
        DocumentVersion.objects.create(
            document=document,
            version_number=new_version,
            file=file_obj,
            uploaded_by=user,
            notes=notes
        )
        return document
