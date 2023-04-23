from flask import Blueprint, jsonify, request
from flask_login import login_required
from app import db, models

skladdb_api_badgeev = Blueprint('skladdb_api_badgeev', __name__)


@skladdb_api_badgeev.route('/api/sklad/badgeev/get', methods=['GET'])
@login_required
def api_get_badgeev():
    item_list = models.Badgeev.query.all()
    return jsonify([item.serialize() for item in item_list])

@skladdb_api_badgeev.route('/api/sklad/badgeev/add', methods=['POST'])
@login_required
def add_row_badgeev():
    data = request.form.to_dict()
    try:
        last_id = models.Badgeev.query.order_by(models.Badgeev.id.desc()).first().id
    except:
        last_id = 0
    new_row = models.Badgeev(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'id': last_id + 1, **data})

@skladdb_api_badgeev.route('/api/sklad/badgeev/get_id')
@login_required
def get_badgeev_items():
    items = models.Badgeev.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@skladdb_api_badgeev.route('/api/sklad/badgeev/get_item')
@login_required
def get_badgeev_item():
    id = request.args.get('id')
    if id is not None:
        item = models.Badgeev.query.filter_by(id=id).first()
        if item:
            return jsonify(item.serialize())
    return jsonify({'error': 'Item not found'})


@skladdb_api_badgeev.route('/api/sklad/badgeev/update_item', methods=['POST'])
@login_required
def update_item():
    data = request.form.to_dict()
    item = models.Badgeev.query.get(data['id'])
    for attribute in models.Badgeev.__table__.columns.keys():
        # Если атрибут есть в request.form, обновляем его значение
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    return jsonify({'success': True})

@skladdb_api_badgeev.route('/api/sklad/badgeev/delete_item', methods=['POST'])
@login_required
def api_delete_badgeev_item():
    item_id = request.form.get('id')
    item = models.Badgeev.query.filter_by(id=item_id).first()

    if not item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })
    
    db.session.delete(item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.Badgeev.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })
