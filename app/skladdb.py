from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from . import db, models

skladdb = Blueprint('skladdb', __name__)


@skladdb.route('/sklad/pc')
@login_required
def sklad_pc():
    pcs = models.PC.query.all()
    return render_template('sklad/pc.html', pcs=pcs)

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
def save():
    try:
        data = request.json
        for product_data in data:
            product = models.Product.query.get(product_data['id'])
            if product is not None:
                product.name = product_data['name']
                product.description = product_data['description']
            else:
                product = models.Product(
                    id=product_data['id'],
                    name=product_data['name'],
                    description=product_data['description']
                )
                db.session.add(product)
        ram_data = request.form.get('ram')
        if ram_data:
            product = models.Product.query.filter_by(name='RAM').first()
            if product is not None:
                product.description = ram_data
            else:
                product = models.Product(
                    name='RAM',
                    description=ram_data
                )
                db.session.add(product)
        motherboard_data = request.form.get('motherboard')
        if motherboard_data:
            product = models.Product.query.filter_by(name='Motherboard').first()
            if product is not None:
                product.description = motherboard_data
            else:
                product = models.Product(
                    name='Motherboard',
                    description=motherboard_data
                )
                db.session.add(product)
        db.session.commit()
        return jsonify({'success': True})
    except:
        return jsonify({'success': False})
