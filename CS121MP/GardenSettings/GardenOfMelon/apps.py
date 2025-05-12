from django.apps import AppConfig

class GardenofMelonConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'GardenOfMelon'

    def ready(self):
        import GardenOfMelon.signals