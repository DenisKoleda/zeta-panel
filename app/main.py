from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from . import db, models

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.username)


