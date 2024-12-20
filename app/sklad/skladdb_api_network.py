from flask import Blueprint, jsonify, request
from flask_login import login_required
from app import db, models

skladdb_api_network = Blueprint('skladdb_api_network', __name__)


@skladdb_api_network.route('/api/sklad/network/get', methods=['GET'])
@login_required
def api_get_pc():
    item_list = models.Network.query.all()
    return jsonify([item.serialize() for item in item_list])

@skladdb_api_network.route('/api/sklad/network/add', methods=['POST'])
@login_required
def add_row_pc():
    data = request.form.to_dict()
    try:
        last_id = models.Network.query.order_by(models.Network.id.desc()).first().id
    except:
        last_id = 0
    new_row = models.Network(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'id': last_id + 1, **data})

@skladdb_api_network.route('/api/sklad/network/get_id')
@login_required
def get_pc_items():
    items = models.Network.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@skladdb_api_network.route('/api/sklad/network/get_item')
@login_required
def get_pc_item():
    id = request.args.get('id')
    if id is not None:
        item = models.Network.query.filter_by(id=id).first()
        if item:
            return jsonify(item.serialize())
    return jsonify({'error': 'Item not found'})


@skladdb_api_network.route('/api/sklad/network/update_item', methods=['POST'])
@login_required
def update_item():
    data = request.form.to_dict()
    item = models.Network.query.get(data['id'])
    for attribute in models.Network.__table__.columns.keys():
        # Если атрибут есть в request.form, обновляем его значение
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    return jsonify({'success': True})

@skladdb_api_network.route('/api/sklad/network/delete_item', methods=['POST'])
@login_required
def api_delete_pc_item():
    item_id = request.form.get('id')
    item = models.Network.query.filter_by(id=item_id).first()

    if not item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })
    
    db.session.delete(item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.Network.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })
