from rest_framework import serializers
from .models import AdventuringFeat, AdventuringFeatPrereq
from django.utils.html import escape
import re

class AdventuringFeatPrereqSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdventuringFeatPrereq
        fields = ["category", "value"]

class AdventuringFeatSerializer(serializers.ModelSerializer):
    prerequisites = AdventuringFeatPrereqSerializer(many=True, read_only=True)
    formatted_description = serializers.SerializerMethodField()

    class Meta:
        model = AdventuringFeat
        fields = ["id", "feat_name", "formatted_description", "prerequisites"]

    def get_formatted_description(self, obj):
        if not obj.feat_description:
            return ""

        formatted_text = escape(obj.feat_description)  # Prevents XSS attacks
        formatted_text = formatted_text.replace("\\n", "<br><br>")  # Convert new lines
        formatted_text = formatted_text.replace("- ", "• ")  # Convert bullet points
        formatted_text = re.sub(r"\*(.*?)\*", r"<strong>\1</strong>", formatted_text)  # Convert *text* to <strong>text</strong>
        formatted_text = re.sub(r"(At Higher Levels\.)", r"<b><i>\1</i></b>", formatted_text)  # Highlight "At Higher Levels."

        return formatted_text