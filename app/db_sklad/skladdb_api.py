from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app import db, models, or_
import json
from urllib.parse import urlparse

skladdb_api = Blueprint('skladdb_api', __name__)


@skladdb_api.route('/api/sklad/get_ram', methods=['GET'])
def api_get_ram():
    ram_list = models.Ram.query.all()
    return jsonify([ram.serialize() for ram in ram_list])

@skladdb_api.route('/api/sklad/get_pc', methods=['GET'])
def api_get_pc():
    pc_list = models.PC.query.all()
    return jsonify([pc.serialize() for pc in pc_list])

@skladdb_api.route('/api/sklad/add_row_pc', methods=['POST'])
def add_row_pc():
    name = request.form['name']
    conf = request.form['conf']
    ip = request.form['ip']
    user = request.form['user']
    smart = request.form['smart']
    last_id = models.PC.query.order_by(models.PC.id.desc()).first().id
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
def get_pc_items():
    items = models.PC.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@skladdb_api.route('/api/sklad/get_pc_item')
def get_pc_item():
    id = request.args.get('id')
    if id is not None:
        item = models.PC.query.filter_by(id=id).first()
        if item:
            return jsonify({'name': item.name, 'conf': item.conf, 'ip_address': item.ip, 'username': item.user, 'is_smart': item.smart})
    return jsonify({'error': 'Item not found'})


@skladdb_api.route('/api/sklad/update_pc_item', methods=['POST'])
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


@skladdb_api.route('/api/sklad/save_all_products', methods=['POST'])
def save_all_products():
    try:
        data = json.loads(request.data)
        print(f"data: {data}")
        page_url = request.headers.get('Referer')
        print(f"page_url: {page_url}")
        path = urlparse(page_url).path
        print(f"path: {path}")
        page_name = path.split('/')[-1]
        print(f"page_name: {page_name}")
        switcher = {
            'ram': models.Ram,
            'motherboard': models.Motherboard,
            'pc': models.PC
        }
        for product_data in data:
            table = switcher.get(page_name.lower(), None)
            if table is not None:
                product = table.query.get(product_data.get('id'))
                if product is not None:
                    for key in product_data:
                        if key not in ['id']:
                            if hasattr(product, key):
                                setattr(product, key, product_data[key])
                            else:
                                print(f'Error: {key} is not a valid column in table {table.__tablename__}!')
                    db.session.commit()
                else:
                    new_product_data = {'id': product_data.get('id')}
                    for key in product_data:
                        if key not in ['id']:
                            if hasattr(table, key):
                                new_product_data[key] = product_data[key]
                            else:
                                print(f'Error: {key} is not a valid column in table {table.__tablename__}!')
                    new_product = table(**new_product_data)
                    db.session.add(new_product)
                    db.session.commit()
                print(f"product_data: {product_data}")
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': 'Произошла ошибка при сохранении данных!'})
