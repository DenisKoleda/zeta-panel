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

@wiki_main.route('/wiki/save', methods=['POST'])
@login_required
def wiki_save():
    data = request.get_json()
    print(data)
    return jsonify({'data':'success'})
        

@wiki_main.route('/wiki/add')
@login_required
def wiki_add():
    text = ''
    return render_template('wiki/wiki_add.html', text=text)


@wiki_main.route('/wiki/<int:id>')
@login_required
def wiki_view(id):
    arcticle = models.Article.query.filter_by(id=id).first()
    data = arcticle.content
    extensions = ['markdown.extensions.codehilite', 'markdown.extensions.fenced_code']
    data = markdown.markdown(data, extensions=extensions)
    
    return render_template('wiki/wiki_preview.html', data=data)