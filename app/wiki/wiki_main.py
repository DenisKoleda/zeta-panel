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
        

@wiki_main.route('/wiki/add', methods=['GET', 'POST'])
@login_required
def wiki_add():
    if request.method == 'POST':
        markdown_text = request.form['markdown']
        #html = markdown.markdown(markdown_text)
        #return render_template('wiki/wiki_preview.html', html=html)
    return render_template('wiki/wiki_add.html')


@wiki_main.route('/wiki/<int:id>')
@login_required
def wiki_view(id):
    arcticle = models.Article.query.filter_by(id=id).first()
    data = arcticle.content
    
    #data = '# Hello\n- some\n- added\n- points\n\n![Image](https://avatars.mds.yandex.net/i?id=4de1a7b9544801737181c156572caf1e584f9906-8199407-images-thumbs&ref=rim&n=33&w=150&h=150 "Image")\n\nCat\n\nand some code\n\n```python\n@wiki_main.route(\'/api/wiki/get\')\n@login_required\ndef wiki_get():\n    data_list = models.Article.query.all()\n    return jsonify([data.serialize() for data in data_list])\n```'
    extensions = ['markdown.extensions.codehilite', 'markdown.extensions.fenced_code']
    data = markdown.markdown(data, extensions=extensions)
    print (data)
    
    return render_template('wiki/wiki_preview.html', data=data)