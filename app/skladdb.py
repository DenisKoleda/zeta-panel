from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from . import db, models

skladdb = Blueprint('skladdb', __name__)


@skladdb.route('/sklad')
@login_required
def sklad():
    products = models.Product.query.all()
    return render_template('sklad.html', products=products)

@skladdb.route('/save_all_products', methods=['POST'])
def save():
    try:
        data = request.json
        for product_data in data:
            product = models.Product.query.get(product_data['id'])
            if product is not None:
                product.name = product_data['name']
                product.description = product_data['description']
                db.session.commit()
        return jsonify({'success': True})
    except:
        return jsonify({'success': False})

@skladdb.route('/delete_all_products', methods=['POST'])
def delete():
    try:
        data = request.json
        for product_id in data:
            product = models.Product.query.get(product_id)
            if product is not None:
                db.session.delete(product)
                db.session.commit()
        return jsonify({'success': True})
    except:
        return jsonify({'success': False})