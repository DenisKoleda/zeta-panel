from flask import Blueprint, jsonify, request
from flask_login import login_required
from app import db, models

skladdb_api_pc = Blueprint('skladdb_api_pc', __name__)


@skladdb_api_pc.route('/api/sklad/pc/get', methods=['GET'])
@login_required
def api_get_pc():
    pc_list = models.PC.query.all()
    return jsonify([pc.serialize() for pc in pc_list])

@skladdb_api_pc.route('/api/sklad/pc/add', methods=['POST'])
@login_required
def add_row_pc():
    data = request.form.to_dict()
    try:
        last_id = models.PC.query.order_by(models.PC.id.desc()).first().id
    except:
        last_id = 0
    new_row = models.PC(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'id': last_id + 1, **data})

@skladdb_api_pc.route('/api/sklad/pc/get_id')
@login_required
def get_pc_items():
    items = models.PC.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@skladdb_api_pc.route('/api/sklad/pc/get_item')
@login_required
def get_pc_item():
    id = request.args.get('id')
    if id is not None:
        item = models.PC.query.filter_by(id=id).first()
        if item:
            return jsonify({'name': item.name, 'conf': item.conf, 'ip_address': item.ip, 'username': item.user, 'is_smart': item.smart})
    return jsonify({'error': 'Item not found'})


@skladdb_api_pc.route('/api/sklad/pc/update_item', methods=['POST'])
@login_required
def update_item():
    id, name, conf, ip, user, smart = [request.form.get(field) for field in ['id', 'name', 'conf', 'ip', 'user', 'smart']]
    item = models.PC.query.get(id)
    item.name, item.conf, item.ip, item.user, item.smart = name, conf, ip, user, smart
    db.session.commit()
    return jsonify({'success': True})

@skladdb_api_pc.route('/api/sklad/pc/delete_item', methods=['POST'])
@login_required
def api_delete_pc_item():
    pc_id = request.form.get('id')
    pc_item = models.PC.query.filter_by(id=pc_id).first()

    if not pc_item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })
    
    db.session.delete(pc_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.PC.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })
