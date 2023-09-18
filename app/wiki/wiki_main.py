from flask import Blueprint, jsonify, redirect, render_template, request
from flask_login import login_required, current_user
from app import models, db
import markdown
import logging

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
    article = models.Article.query.filter_by(id=data['id']).first()
    article.content = data['content']
    article.content_html = data['contentHTML']
    db.session.commit()
    return jsonify({'data':'success'})
        

@wiki_main.route('/wiki/modify/<int:id>')
@login_required
def wiki_add(id):
    article = models.Article.query.filter_by(id=id).first()
    if not article.content:
        text = ''
    else:
        text = article.content
    return render_template('wiki/wiki_modify.html', text=text, id=id, title=article.title)


@wiki_main.route('/wiki/<int:id>')
@login_required
def wiki_view(id):
    article = models.Article.query.filter_by(id=id).first()
    data = article.content_html
    if data:
        extensions = ['markdown.extensions.codehilite', 'markdown.extensions.fenced_code']
        data = markdown.markdown(data, extensions=extensions)
    else:
        data = 'Ничего нет :( напишите что-нибудь'
    return render_template('wiki/wiki_preview.html', data=data, title=article.title, id=article.id)


@wiki_main.route('/api/wiki/get', methods=['GET'])
@login_required
def api_get_wikis():
    wiki_list = models.Article.query.all()
    return jsonify([wiki.serialize() for wiki in wiki_list])


@wiki_main.route('/api/wiki/add', methods=['POST'])
@login_required
def add_wiki():
    logging.info(f"Request add wiki: {request.form} from {current_user.username} by IP {request.remote_addr}")
    data = request.form.to_dict()
    new_row = models.Article(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'success': True})


@wiki_main.route('/api/wiki/get_id')
@login_required
def get_wikis_id():
    logging.info(f"Request get wiki id from {current_user.username} by IP {request.remote_addr}")
    if current_user.role == 'Admin':
        items = models.Article.query.all()
    else:
        items = models.Article.query.filter(models.Article.status != "Закрыто").all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)
        

@wiki_main.route('/api/wiki/get_item')
@login_required
def get_wiki_item():
    logging.info(f"Request get wiki item from {current_user.username} by IP {request.remote_addr}")    
    wiki_id = request.args.get('id')

    if wiki_id:
        wiki = models.Article.query.filter_by(id=wiki_id).first()

        if wiki:
            return jsonify(wiki.serialize())

        return jsonify({'error': 'Wiki not found'})
    
    return jsonify({ 'success': False })


@wiki_main.route('/api/wiki/update_item', methods=['POST'])
@login_required
def update_wiki_item():
    logging.info(f"Request update wiki item {request.form} from {current_user.username} by IP {request.remote_addr}")
    data = request.form.to_dict()
    item = models.Article.query.get(data['id'])
    for attribute in models.Article.__table__.columns.keys():
        # Если атрибут есть в request.form, обновляем его значение
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    return jsonify({'success': True})

@wiki_main.route('/api/wiki/delete_item', methods=['POST'])
@login_required
def delete_wiki_item():
    logging.info(f"Request delete wiki item {request.form} from {current_user.username} by IP {request.remote_addr}")
    wikis_id = request.form.get('id')
    wikis_item = models.Article.query.filter_by(id=wikis_id).first()

    if not wikis_item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })

    db.session.delete(wikis_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.Article.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })