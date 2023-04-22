from flask import Blueprint, jsonify, request
from flask_login import login_required
from app import db, models

skladdb_api = Blueprint('skladdb_api', __name__)


@skladdb_api.route('/api/sklad/get_pc', methods=['GET'])
@login_required
def api_get_pc():
    pc_list = models.PC.query.all()
    return jsonify([pc.serialize() for pc in pc_list])

@skladdb_api.route('/api/sklad/add_row_pc', methods=['POST'])
@login_required
def add_row_pc():
    name = request.form['name']
    conf = request.form['conf']
    ip = request.form['ip']
    user = request.form['user']
    smart = request.form['smart']
    try:
        last_id = models.PC.query.order_by(models.PC.id.desc()).first().id
    except:
        last_id = 0
    new_row = models.PC(name=name, conf=conf, ip=ip, user=user, smart=smart)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({
        'id': last_id + 1,
        'name': name,
        'conf': conf,
        'ip': ip,
        'user': user,
        'smart': smart
    })

@skladdb_api.route('/api/sklad/get_pc_items_id')
@login_required
def get_pc_items():
    items = models.PC.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@skladdb_api.route('/api/sklad/get_pc_item')
@login_required
def get_pc_item():
    id = request.args.get('id')
    if id is not None:
        item = models.PC.query.filter_by(id=id).first()
        if item:
            return jsonify({'name': item.name, 'conf': item.conf, 'ip_address': item.ip, 'username': item.user, 'is_smart': item.smart})
    return jsonify({'error': 'Item not found'})


@skladdb_api.route('/api/sklad/update_pc_item', methods=['POST'])
@login_required
def update_item():
    id = request.form['id']
    name = request.form['name']
    conf = request.form['conf']
    ip = request.form['ip']
    user = request.form['user']
    smart = request.form['smart']
    item = models.PC.query.get(id)
    item.name = name
    item.conf = conf
    item.ip = ip
    item.user = user
    item.smart = smart
    db.session.commit()
    return jsonify({'id': item.id, 'name': item.name, 'conf': item.conf, 'ip': item.ip, 'user': item.user, 'smart': item.smart})

@skladdb_api.route('/api/sklad/delete_pc_item', methods=['POST'])
@login_required
def api_delete_pc_item():
    pc_id = request.form.get('id')
    pc_item = models.PC.query.filter_by(id=pc_id).first()

    if pc_item:
        db.session.delete(pc_item)
        db.session.commit()

        # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
        pc_items = models.PC.query.all()
        for i in range(len(pc_items)):
            pc_items[i].id = i + 1

        db.session.commit()

        return jsonify({ 'success': True })
    else:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })

@skladdb_api.route('/api/sklad/get_ram', methods=['GET'])
@login_required
def api_get_ram():
    ram_list = models.Ram.query.all()
    return jsonify([ram.serialize() for ram in ram_list])