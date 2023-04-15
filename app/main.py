from flask import Blueprint, render_template
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


@main.route('/sklad')
@login_required
def sklad():
    products = models.Product.query.all()
    return render_template('sklad.html', products=products)