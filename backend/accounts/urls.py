from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserView, RegisterView, VerifyEmailView, check_username, check_email

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserView.as_view(), name='user'),
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("check-username/", check_username, name="check-username"),
    path("check-email/", check_email, name="check-email"),
]