from rest_framework import serializers
from .models import Spell, Class

class SpellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spell
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ["class_name"]