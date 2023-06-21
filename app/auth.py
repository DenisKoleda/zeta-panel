from datetime import datetime, timedelta
from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_user, login_required, logout_user, current_user
from itsdangerous import URLSafeTimedSerializer
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message
from .models import User
from . import db, mail
from flask import current_app
import logging

auth = Blueprint('auth', __name__)


def send_email(subject, recipients, text_body, html_body):
    msg = Message(subject, sender=current_app.config['MAIL_USERNAME'], recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    mail.send(msg)


@auth.route('/login')
def login():
    return render_template('login.html')


@auth.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        logging.warning(f'Login user failed with email {email} by IP {request.remote_addr}')
        flash('Неверный адрес электронной почты или пароль')
        return redirect(url_for('auth.login'))
    login_user(user, remember=remember)
    logging.info(f'Login user {user.username} with email {email} by IP {request.remote_addr}')
    return redirect(url_for('main.index'))


@auth.route('/forgot_password')
def forgot_password():
    return render_template('forgot_password.html')


@auth.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password_post():
    email = request.form.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('Аккаунта с данной электронной почтой не существует')
        return redirect(url_for('auth.forgot_password'))
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    token = s.dumps({'user_id': user.id, 'exp': (datetime.utcnow() + timedelta(minutes=30)).strftime('%Y-%m-%d %H:%M:%S')})
    reset_link = url_for('auth.reset_password', token=token, _external=True)
    html_body = render_template('reset_password_email.html', reset_link=reset_link)
    send_email('Восстановление пароля', [email], None, html_body)
    flash('Проверьте вашу электронную почту')
    logging.info(f'Sending recovery email to {email}')
    return redirect(url_for('auth.login'))


@auth.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token, max_age=1800) # max_age в секундах
    except:
        flash('Недействительная или просроченная ссылка для восстановления пароля')
        return redirect(url_for('auth.forgot_password'))
    user = User.query.get(data['user_id'])
    if request.method == 'POST':
        password = request.form.get('password')
        user.password = generate_password_hash(password, method='sha256')
        db.session.commit()
        flash('Ваш пароль успешно изменен!')
        return redirect(url_for('auth.login'))
    return render_template('reset_password.html', token=token)

# @auth.route('/signup')
# def signup():
#     return render_template('signup.html')

# @auth.route('/signup', methods=['POST'])
# def signup_post():
#     email = request.form.get('email')
#     username = request.form.get('username')
#     password = request.form.get('password')
#     role = 'User'

#     user = User.query.filter_by(
#         email=email).first()

#     if user:
#         flash('Адрес электронной почты уже существует')
#         return redirect(url_for('auth.signup'))

#     new_user = User(email=email, username=username, password=generate_password_hash(password, method='sha256') , role=role)

#     db.session.add(new_user)
#     db.session.commit()

#     return redirect(url_for('auth.login'))

# <p class="text-center">
#     <a href={{ url_for('auth.signup') }}>Регистрация</a>
# </p>


@auth.route('/logout')
@login_required
def logout():
    logging.info(f'User {current_user.username} with email {current_user.email} by IP {request.remote_addr} logged out')
    logout_user()
    return redirect(url_for('main.index'))
