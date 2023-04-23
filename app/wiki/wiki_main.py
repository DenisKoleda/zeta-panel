from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user

wiki_main = Blueprint('wiki_main', __name__)


@wiki_main.route('/wiki')
@login_required
def index():
    return render_template('wiki/wiki_main.html', name=current_user.username)