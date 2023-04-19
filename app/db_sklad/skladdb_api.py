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


@skladdb_api.route('/api/sklad/save_all_products', methods=['POST'])
def save_all_products():
    try:
        data = json.loads(request.data)
        print(f"data: {data}")
        page_url = request.headers.get('Referer')
        print(f"page_url: {page_url}")
        path = urlparse(page_url).path
        print(f"path: {path}")
        page_name = path.split('/')[-2]
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
