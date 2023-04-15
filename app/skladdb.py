from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from . import db, models
import json
from urllib.parse import urlparse

skladdb = Blueprint('skladdb', __name__)


@skladdb.route('/sklad/pc/')
@login_required
def sklad_pc():
    page = request.args.get('page', 1, type=int)
    pcs = models.PC.query.order_by(models.PC.id.asc()).paginate(page=page, per_page=5, error_out=False)
    return render_template('sklad/pc.html', pcs=pcs, page=page)

@skladdb.route('/sklad/ram')
@login_required
def sklad_ram():
    rams = models.Ram.query.all()
    return render_template('sklad/ram.html', rams=rams)

@skladdb.route('/sklad/motherboard')
@login_required
def sklad_motherboard():
    motherboards = models.Motherboard.query.all()
    return render_template('sklad/motherboard.html', motherboards=motherboards)


@skladdb.route('/sklad/save_all_products', methods=['POST'])
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
