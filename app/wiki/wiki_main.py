from flask import Blueprint, jsonify, redirect, render_template, request
from flask_login import login_required, current_user
from app import models, db
import markdown

wiki_main = Blueprint('wiki_main', __name__)

@wiki_main.route('/wiki')
@login_required
def wiki():
    return render_template('wiki/wiki_main.html', name=current_user.username)

@wiki_main.route('/api/wiki/get')
@login_required
def wiki_get():
    data_list = models.Article.query.all()
    return jsonify([data.serialize() for data in data_list])

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

@wiki_main.route('/wiki/add', methods=['GET', 'POST'])
@login_required
def wiki_add():
    if request.method == 'POST':
        markdown_text = request.form['markdown']
        html = markdown.markdown(markdown_text)
        return render_template('wiki/wiki_preview.html', html=html)
    return render_template('wiki/wiki_add.html')


@wiki_main.route('/wiki/<int:id>')
@login_required
def wiki_view(id):
    return redirect ('/wiki')