from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from .serializers import UserSerializer, RegisterSerializer
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import api_view

@api_view(["GET"])
def check_username(request):
    username = request.GET.get("username", "")
    exists = User.objects.filter(username__iexact=username).exists()
    return Response({"available": not exists})

@api_view(["GET"])
def check_email(request):
    email = request.GET.get("email", "")
    exists = User.objects.filter(email__iexact=email).exists()
    return Response({"available": not exists})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.is_active = False
        user.save()

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        domain = get_current_site(self.request).domain
        verification_link = f"http://{domain}/api/auth/verify-email/{uid}/{token}/"

        send_mail(
            "Verify Your Email",
            "",
            "no-reply@illadrya-database.com",
            [user.email],
            fail_silently=False,
            html_message=f"""
            <html>
                <body>
                    <h2>Welcome to Illadrya Database!</h2>
                    <p>Click the link below to verify your email:</p>
                    <p><a href="{verification_link}" style="color:blue;">Verify Email</a></p>
                    <p>If you did not sign up, please ignore this email.</p>
                </body>
            </html>
            """,
        )

        return Response({"message": "User registered successfully. Please verify your email."}, status=status.HTTP_201_CREATED)

class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({"message": "Email successfully verified!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username__iexact=username).first()
        
        if user and user.check_password(password):
            if not user.is_active:
                return Response({'error': 'Please verify your email before logging in.'}, status=403)

            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': UserSerializer(user).data})

        return Response({'error': 'Invalid username or password'}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.auth.delete()
        return Response({'message': 'Logged out successfully'})

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
