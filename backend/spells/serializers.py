from rest_framework import serializers
from .models import Spell, Class
from django.utils.html import escape
import re

class SpellSerializer(serializers.ModelSerializer):
    formatted_description = serializers.SerializerMethodField()

    class Meta:
        model = Spell
        fields = [
            "spell_name",
            "spell_level",
            "spell_school",
            "spell_casting_time",
            "spell_reaction",
            "spell_ritual",
            "spell_range",
            "spell_components",
            "spell_materials",
            "spell_duration",
            "spell_concentration",
            "classes",
            "formatted_description",
        ]
    
    def get_formatted_description(self, obj):
        if not obj.spell_description:
            return ""

        formatted_text = escape(obj.spell_description)  # Prevents XSS attacks
        formatted_text = formatted_text.replace("\\n", "<br><br>")  # Convert new lines
        formatted_text = formatted_text.replace("- ", "• ")  # Convert bullet points
        formatted_text = re.sub(r"\*(.*?)\*", r"<strong>\1</strong>", formatted_text)  # Convert *text* to <strong>text</strong>
        formatted_text = re.sub(r"(At Higher Levels\.)", r"<b><i>\1</i></b>", formatted_text)  # Highlight "At Higher Levels."

        return formatted_text

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ["class_name"]