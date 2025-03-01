from django.urls import path
from .views import RegisterView, VerifyEmailView, LoginView, LogoutView, UserView, check_username, check_email

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/", UserView.as_view(), name="user"),
    path("check-username/", check_username, name="check-username"),
    path("check-email/", check_email, name="check-email"),
]