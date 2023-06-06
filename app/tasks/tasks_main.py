from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models, API_URL
import requests as req
import threading
import datetime

tasks_main = Blueprint('tasks_main', __name__)


@tasks_main.route('/tasks')
@login_required
def tasks_maim_page():
    return render_template('tasks/task_main.html')

@tasks_main.route('/tasks/<id>')
@login_required
def tasks_page(id):
    task = models.Tasks.query.filter_by(id=id).first()
    return render_template('tasks/task.html', task=task)

@tasks_main.route('/api/tasks/get', methods=['GET'])
@login_required
def api_get_tasks():
    task_list = models.Tasks.query.all()
    return jsonify([task.serialize() for task in task_list])


@tasks_main.route('/api/tasks/add', methods=['POST'])
@login_required
def add_task():
    data = request.form.to_dict()
    tg_notify = data.pop('telegram_notification', False)
    new_row = models.Tasks(**data)
    db.session.add(new_row)
    db.session.commit()
    if tg_notify:
        users = models.User.query.filter_by(role='User').all()
        telegram_new_task(new_row, users)
    return jsonify({'success': True})


@tasks_main.route('/api/tasks/get_id')
@login_required
def get_tasks_id():
    items = models.Tasks.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@tasks_main.route('/api/tasks/get_item')
@login_required
def get_task_item():
    task_id = request.args.get('id')

    if task_id:
        task = models.Tasks.query.filter_by(id=task_id).first()

        if task:
            return jsonify(task.serialize())

        return jsonify({'error': 'Task not found'})
    
    return jsonify({ 'success': False })


@tasks_main.route('/api/tasks/update_item', methods=['POST'])
@login_required
def update_task_item():
    data = request.form.to_dict()
    tg_notify = data.pop('telegram_notification', False)
    item = models.Tasks.query.get(data['id'])
    for attribute in models.Tasks.__table__.columns.keys():
        # Если атрибут есть в request.form, обновляем его значение
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    if tg_notify:
        users = models.User.query.filter_by(role='User').all()
        telegram_change_task(item, users)
    return jsonify({'success': True})


# @tasks_main.route('/api/tasks/update_item_comment', methods=['POST'])
# @login_required
# def update_item_comment():
#     data = request.form.to_dict()
#     item = models.Tasks.query.get(data['id'])
#     for attribute in models.Tasks.__table__.columns.keys():
#         # Если атрибут есть в request.form, обновляем его значение
#         if attribute in request.form:
#             setattr(item, attribute, request.form[attribute])
#     db.session.commit()
#     users = models.User.query.filter_by(role='Admin').all()
#     threading.Thread(target=telegram_update_item_comment, kwargs={'data': data, 'users': users}).start()
#     return jsonify({ 'success': True })

@tasks_main.route('/api/tasks/update_item_status', methods=['POST'])
@login_required
def update_item_status():
    data = request.form.to_dict()
    item = models.Tasks.query.filter_by(id=data['id']).first()
    time_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    for attribute in request.form:
        # Если атрибут есть в request.form, обновляем его значение
        if hasattr(item, attribute):
            if attribute == 'status' and request.form[attribute] == 'В Работе' and item.time_started is None:
                item.time_started = time_now
            if attribute == 'status' and request.form[attribute] == 'Выполнено':
                item.time_finished = time_now
                item.time_wasted = str(datetime.datetime.strptime(item.time_finished, '%Y-%m-%d %H:%M') - datetime.datetime.strptime(item.time_started, '%Y-%m-%d %H:%M'))
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    if data['status'] != 'Закрыто':
        users = models.User.query.filter_by(role='Admin').all()
        telegram_update_item_status(item, users)
    elif data['status'] == 'Возобновлена':
        users = models.User.query.filter_by(role='User').all()
        telegram_update_item_status(item, users)
    return jsonify({ 'success': True })



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

def time_wasted(time_started, time_finished):
    return datetime.datetime.strptime(time_finished, '%Y-%m-%d %H:%M') - datetime.datetime.strptime(time_started, '%Y-%m-%d %H:%M')

def telegram_new_task(data, users):
    try:
        message = (
            f"🛠️ НОВАЯ ЗАДАЧА\n"
            f"🕑 Дата: {data.date}\n"
            f"🔨 Задача: {data.ticket}\n"
            f"⚒️ Описание задачи: {data.ticket_comment}\n"
            f"❗ Приоритет: {data.priority}\n"
            f"📈 Статус: {data.status}\n"
            f"🟥 Заказчик: {data.user_init}\n"
            f"👁️ Исполнитель: {data.executor}\n"
            f"⌛ Дедлайн: {data.deadline}"
        )
        for user in users:
            url = f"{API_URL}sendMessage?chat_id={user.telegram}&text={message}"
            req.get(url)
            print(f"Send message: new task to {user.username}: {user.telegram}")
    except Exception as e:
        print(f"TG Error: {e}")
    
def telegram_change_task(data, users):
    try:
        message = (
            f"🛠️ ЗАДАЧА ОБНОВЛЕННА\n"
            f"🕑 Дата: {data.date}\n"
            f"🔨 Задача: {data.ticket}\n"
            f"⚒️ Описание задачи: {data.ticket_comment}\n"
            f"❗ Приоритет: {data.priority}\n"
            f"📈 Статус: {data.status}\n"
            f"🟥 Заказчик: {data.user_init}\n"
            f"👁️ Исполнитель: {data.executor}\n"
            f"⌛ Дедлайн: {data.deadline}"
        )
        
        for user in users:
            url = f'{API_URL}sendMessage?chat_id={user.telegram}&text={message}'
            req.get(url)
            print(f"Send message: task updated to {user.username}: {user.telegram}")
    except Exception as e:
        print(f"TG Error: {e}")
    
# def telegram_update_item_comment(data, users):
#     try:
#         data = f"🛠️ В ЗАДАЧЕ ПОЯВИЛСЯ КОММЕНТАРИЙ\n" \
#         f"🕑 Номер задачи: {data['id']}\n" \
#         f"🔨 Комментарий: {data['comment']}\n" \
        
#         for i in users:
#             url = f'{API_URL}sendMessage?chat_id={i.telegram}&text={data}'
#             req.get(url)
            
#     except Exception as e:
#         pass
    

def telegram_update_item_status(data, users):
    try:
        if data.status != 'Возобновлена':
            message = (
            f"🛠️ ЗАДАЧА ПЕРЕШЛА В НОВЫЙ СТАТУС\n" \
            f"🕑 Номер задачи: {data.id}\n" \
            f"🔨 Задача: {data.ticket}\n"
            f"⚒️ Описание задачи: {data.ticket_comment}\n"
            f"👁️ Исполнитель: {data.executor}\n" \
            f"📈 Статус: {data.status}\n"
            )
        else:
            message = (
            f"🛠️ ЗАДАЧА ВОЗОБНОВЛЕННА\n" \
            f"🕑 Номер задачи: {data.id}\n" \
            f"🔨 Задача: {data.ticket}\n"
            f"⚒️ Описание задачи: {data.ticket_comment}\n"
            f"📈 Статус: {data.status}\n" 
            )
        
        print(message)
        for user in users:
            url = f'{API_URL}sendMessage?chat_id={user.telegram}&text={message}'
            req.get(url)
            print(f"Send message: task status to {user.username}: {user.telegram}")
                
    except Exception as e:
        print(f"TG Error: {e}")