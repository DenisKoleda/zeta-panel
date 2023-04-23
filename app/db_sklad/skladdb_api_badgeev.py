from flask import Blueprint, jsonify, request
from flask_login import login_required
from app import db, models

skladdb_api_badgeev = Blueprint('skladdb_api_badgeev', __name__)


@skladdb_api_badgeev.route('/api/sklad/badgeev/get', methods=['GET'])
@login_required
def api_get_badgeev():
    badgeev_list = models.Badgeev.query.all()
    return jsonify([badgeev.serialize() for badgeev in badgeev_list])

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
            return jsonify({'ip': item.ip, 'vlan': item.vlan, 'cores': item.cores, 'config': item.config, 'status': item.status, 'smart': item.smart, 'switch': item.switch, 'switch_port': item.switch_port, 'rack': item.rack, 'comment': item.comment})
    return jsonify({'error': 'Item not found'})


@skladdb_api_badgeev.route('/api/sklad/badgeev/update_item', methods=['POST'])
@login_required
def update_item():
    id, ip, vlan, cores, config, status, smart, switch, switch_port, rack, comment = [request.form.get(field) for field in ['id', 'ip', 'vlan', 'cores', 'config', 'status', 'smart', 'switch', 'switch_port', 'rack', 'comment']]
    item = models.Badgeev.query.get(id)
    item.ip, item.vlan, item.cores, item.config, item.status, item.smart, item.switch, item.switch_port, item.rack, item.comment = ip, vlan, cores, config, status, smart, switch, switch_port, rack, comment
    db.session.commit()
    return jsonify({'success': True})

@skladdb_api_badgeev.route('/api/sklad/badgeev/delete_item', methods=['POST'])
@login_required
def api_delete_badgeev_item():
    badgeev_id = request.form.get('id')
    badgeev_item = models.Badgeev.query.filter_by(id=badgeev_id).first()

    if not badgeev_item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })
    
    db.session.delete(badgeev_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.Badgeev.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })
