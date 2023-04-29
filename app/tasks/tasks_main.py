from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models, API_URL
import requests as req
import threading

tasks_main = Blueprint('tasks_main', __name__)


@tasks_main.route('/tasks')
@login_required
def tasks_maim_page():
    return render_template('tasks/task_main.html')


@tasks_main.route('/api/tasks/get', methods=['GET'])
@login_required
def api_get_tasks():
    task_list = models.Tasks.query.all()
    return jsonify([task.serialize() for task in task_list])


@tasks_main.route('/api/tasks/add', methods=['POST'])
@login_required
def add_task():
    data = request.form.to_dict()
    try:
        last_id = models.Tasks.query.order_by(models.Tasks.id.desc()).first().id
    except:
        last_id = 0
    users = models.User.query.filter_by(role='User').all()
    threading.Thread(target=telegram_new_task, kwargs={'data': data, 'users': users}).start()
    new_row = models.Tasks(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'id': last_id + 1, **data})



@tasks_main.route('/api/tasks/get_id')
@login_required
def get_tasks_id():
    items = models.Tasks.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@tasks_main.route('/api/tasks/get_item')
@login_required
def get_task_item():
    id = request.args.get('id')
    if id is not None:
        item = models.Tasks.query.filter_by(id=id).first()
        if item:
            return jsonify(item.serialize())
    return jsonify({'error': 'Item not found'})


@tasks_main.route('/api/tasks/update_item', methods=['POST'])
@login_required
def update_task_item():
    data = request.form.to_dict()
    item = models.Tasks.query.get(data['id'])
    for attribute in models.Tasks.__table__.columns.keys():
        # Если атрибут есть в request.form, обновляем его значение
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    users = models.User.query.all()
    threading.Thread(target=telegram_change_task, kwargs={'data': data, 'users': users}).start()
    return jsonify({'success': True})


@tasks_main.route('/api/tasks/delete_item', methods=['POST'])
@login_required
def delete_task_item():
    tasks_id = request.form.get('id')
    tasks_item = models.Tasks.query.filter_by(id=tasks_id).first()

    if not tasks_item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })

    db.session.delete(tasks_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    for i, item in enumerate(models.Tasks.query.all(), 1):
        item.id = i
    db.session.commit()

    return jsonify({ 'success': True })

def telegram_new_task(data, users):
    # TODO Добавить chat_id из DB пользователей
    try:
        data = f"НОВАЯ ЗАДАЧА\n\n" \
        f"Дата: {data['date']}\n" \
        f"Задача: \n{data['ticket']}\n" \
        f"Описание задачи: \n{data['ticket_comment']}\n" \
        f"Приоритет: {data['priority']}\n" \
        f"Статус: {data['status']}\n" \
        f"Исполнитель: {data['executor']}\n" \
        f"Дедлайн: {data['deadline']}"
        for i in users:
            url = f'{API_URL}sendMessage?chat_id={i.telegram}&text={data}'
            req.get(url)
    except Exception as e:
        pass
    
def telegram_change_task(data, users):
    try:
        data = f"ЗАДАЧА ОБНОВЛЕННА\n\n" \
        f"Дата: {data['date']}\n" \
        f"Задача: \n{data['ticket']}\n" \
        f"Описание задачи: \n{data['ticket_comment']}\n" \
        f"Приоритет: {data['priority']}\n" \
        f"Статус: {data['status']}\n" \
        f"Исполнитель: {data['executor']}\n" \
        f"Дедлайн: {data['deadline']}"
        
        for i in users:
            url = f'{API_URL}sendMessage?chat_id={i.telegram}&text={data}'
            req.get(url)
            
    except Exception as e:
        pass