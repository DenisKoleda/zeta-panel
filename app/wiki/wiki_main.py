from flask import Blueprint, jsonify, redirect, render_template, request
from flask_login import login_required, current_user
from app import models, db

wiki_main = Blueprint('wiki_main', __name__)

@wiki_main.route('/wiki')
@login_required
def wiki():
    return render_template('wiki/wiki_main.html', name=current_user.username)

@wiki_main.route('/wiki/get')
@login_required
def wiki_get():
    return jsonify(models.Article.query.all())

@wiki_main.route('/wiki/save', methods=['GET', 'POST'])
@login_required
def wiki_save():
    if request.method == 'GET':
        return redirect ('/wiki')
    else:
        values = request.form
        content = values.get('mdeditor')
        new_article = models.Article()
        new_article.content = content
        db.session.add(new_article)
        db.session.commit()
        return redirect ('/wiki')

@wiki_main.route('/wiki/add')
@login_required
def wiki_add():
    return render_template('wiki/wiki_add.html')

@wiki_main.route('/wiki/<int:aritlce_id>')
@login_required
def wiki_view(aritlce_id):
    pass