from django.db import models

class AdventuringFeat(models.Model):
    feat_name = models.CharField(max_length=255, unique=True)
    feat_description = models.TextField()
    
    class Meta:
        db_table = "adventuring_feats"
        managed = False

    def __str__(self):
        return self.feat_name

class AdventuringFeatPrereq(models.Model):
    feat = models.ForeignKey(AdventuringFeat, on_delete=models.CASCADE, related_name="prerequisites")
    category = models.CharField(max_length=50)
    value = models.CharField(max_length=255)

    class Meta:
        db_table = "adventuring_feat_prereqs"
        managed = False

    def __str__(self):
        return f"{self.category}: {self.value}"
