from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from . import db, models, or_
import json
from urllib.parse import urlparse

skladdb = Blueprint('skladdb', __name__)


@skladdb.route('/sklad/pc/')
@login_required
def sklad_pc():
    page = request.args.get('page', 1, type=int)
    filter_value = request.args.get('search', '').lower()

    # Получаем список всех доступных ключей в таблице PC
    keys = [column.name for column in models.PC.__table__.columns]

    query = models.PC.query.order_by(models.PC.id.asc())

    if filter_value:
        # Для каждого ключа в таблице PC добавляем фильтр
        # и объединяем все фильтры с помощью оператора or_
        filters = [getattr(models.PC, key).ilike(f'%{filter_value}%') for key in keys]
        query = query.filter(or_(*filters))

    data = query.paginate(page=page, per_page=5, error_out=False)
    return render_template('sklad/pc.html', data=data, page=page)



@skladdb.route('/sklad/ram/')
@login_required
def sklad_ram():
    page = request.args.get('page', 1, type=int)
    data = models.Ram.query.order_by(models.Ram.id.asc()).paginate(page=page, per_page=5, error_out=False)
    return render_template('sklad/ram.html', data=data, page=page)

@skladdb.route('/sklad/motherboard/')
@login_required
def sklad_motherboard():
    page = request.args.get('page', 1, type=int)
    data = models.Motherboard.query.order_by(models.Motherboard.id.asc()).paginate(page=page, per_page=5, error_out=False)
    return render_template('sklad/motherboard.html', data=data, page=page)


@skladdb.route('/sklad/api/save_all_products', methods=['POST'])
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
