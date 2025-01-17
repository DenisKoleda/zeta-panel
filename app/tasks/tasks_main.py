import aiohttp
from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models, API_URL
import logging
from urllib.parse import quote
import datetime
import asyncio

tasks_main = Blueprint('tasks_main', __name__)

# Create an event loop for asyncio
loop = asyncio.get_event_loop()

@tasks_main.route('/tasks')
@login_required
def tasks_main_page():
    users = models.User.query.filter_by(role="User")
    admins = models.User.query.filter_by(role="Admin")
    listusers=[] + [admin.username for admin in admins] + [user.username for user in users]
    return render_template('tasks/task_main.html', listusers=listusers)

@tasks_main.route('/all_tasks')
@login_required
def tasks_main_page_all():
    users = models.User.query.filter_by(role="User")
    admins = models.User.query.filter_by(role="Admin")
    listusers=[] + [admin.username for admin in admins] + [user.username for user in users]
    return render_template('tasks/task_main.html', listusers=listusers)

@tasks_main.route('/task/<id>')
@login_required
def tasks_page(id):
    task = models.Tasks.query.filter_by(id=id).first()
    return render_template('tasks/task.html', task=task)

@tasks_main.route('/api/tasks/get_all', methods=['GET', 'POST'])
@login_required
async def api_get_tasks_all():
    query = models.Tasks.query

    # SearchPanes - only include necessary fields
    sp_fields = ['priority', 'status', 'executor', 'user_init']
    searchpanes = {'options': {}}
    
    # Get distinct values and counts for each field in a single query
    for sp_field in sp_fields:
        subquery = db.session.query(
            getattr(models.Tasks, sp_field),
            db.func.count(models.Tasks.id).label('count')
        ).group_by(getattr(models.Tasks, sp_field)).having(getattr(models.Tasks, sp_field).isnot(None))
        
        searchpanes['options'][sp_field] = []
        for value, count in subquery.all():
            if value:  # Skip empty values
                name_d = {
                    "label": value,
                    "total": count,
                    "value": value,
                    "count": count
                }
                searchpanes['options'][sp_field].append(name_d)
            
        # Apply SearchPanes filter if present
        if request.args.get(f'searchPanes[{sp_field}][0]'):
            sp_filter = []
            i = 0
            while True:
                col_name = request.args.get(f'searchPanes[{sp_field}][{i}]')
                if col_name is None:
                    break
                sp_filter.append(col_name)
                i += 1
            if sp_filter:
                query = query.filter(getattr(models.Tasks, sp_field).in_(sp_filter))

    # Search
    search = request.args.get('search[value]')
    if search:
        query = query.filter(db.or_(
            models.Tasks.id.like(f'%{search}%'),
            models.Tasks.user_init.like(f'%{search}%'),
            models.Tasks.ticket.like(f'%{search}%'),
            models.Tasks.ticket_comment.like(f'%{search}%'),
            models.Tasks.priority.like(f'%{search}%'),
            models.Tasks.status.like(f'%{search}%'),
            models.Tasks.executor.like(f'%{search}%'),
        ))

    total_filtered = query.count()

    # Sorting
    order = []
    i = 0
    while True:
        col_index = request.args.get(f'order[{i}][column]')
        if col_index is None:
            break
        col_name = request.args.get(f'columns[{col_index}][data]')
        if col_name not in ['id', 'date', 'user_init', 'ticket', 'ticket_comment', 'priority', 'status', 'executor']:
            col_name = 'id'
        descending = request.args.get(f'order[{i}][dir]') == 'desc'
        col = getattr(models.Tasks, col_name)
        if descending:
            col = col.desc()
        order.append(col)
        i += 1
    if order:
        query = query.order_by(*order)

    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # Response
    return {
        'data': [task.serialize() for task in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': models.Tasks.query.count(),
        'draw': request.args.get('draw', type=int),
        'searchPanes': searchpanes
    }

@tasks_main.route('/api/tasks/get', methods=['GET'])
@login_required
async def api_get_tasks():
    # Base query with status filter
    query = models.Tasks.query.filter(models.Tasks.status.notin_(["Закрыто", "Выполнено"]))

    # SearchPanes - only include necessary fields
    sp_fields = ['id', 'date', 'user_init', 'ticket', 'ticket_comment', 'priority', 'status', 'executor']
    searchpanes = {'options': {}}
    
    # Get distinct values and counts for each field in a single query
    for sp_field in sp_fields:
        subquery = db.session.query(
            getattr(models.Tasks, sp_field),
            db.func.count(models.Tasks.id).label('count')
        ).group_by(getattr(models.Tasks, sp_field)).having(getattr(models.Tasks, sp_field).isnot(None))
        
        searchpanes['options'][sp_field] = []
        for value, count in subquery.all():
            if value:  # Skip empty values
                searchpanes['options'][sp_field].append({
                    "label": value,
                    "total": count,
                    "value": value,
                    "count": count
                })
            
        # Apply SearchPanes filter if present
        if request.args.get(f'searchPanes[{sp_field}][0]'):
            sp_filter = []
            i = 0
            while True:
                col_name = request.args.get(f'searchPanes[{sp_field}][{i}]')
                if col_name is None:
                    break
                sp_filter.append(col_name)
                i += 1
            if sp_filter:
                query = query.filter(getattr(models.Tasks, sp_field).in_(sp_filter))

    # Search
    search = request.args.get('search[value]')
    if search:
        query = query.filter(db.or_(
            models.Tasks.id.like(f'%{search}%'),
            models.Tasks.user_init.like(f'%{search}%'),
            models.Tasks.ticket.like(f'%{search}%'),
            models.Tasks.ticket_comment.like(f'%{search}%'),
            models.Tasks.priority.like(f'%{search}%'),
            models.Tasks.status.like(f'%{search}%'),
            models.Tasks.executor.like(f'%{search}%'),
        ))

    total_filtered = query.count()

    # Sorting
    order = []
    i = 0
    while True:
        col_index = request.args.get(f'order[{i}][column]')
        if col_index is None:
            break
        col_name = request.args.get(f'columns[{col_index}][data]')
        if col_name not in ['id', 'date', 'user_init', 'ticket', 'ticket_comment', 'priority', 'status', 'executor']:
            col_name = 'id'
        descending = request.args.get(f'order[{i}][dir]') == 'desc'
        col = getattr(models.Tasks, col_name)
        if descending:
            col = col.desc()
        order.append(col)
        i += 1
    if order:
        query = query.order_by(*order)

    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # Response
    return {
        'data': [task.serialize() for task in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': models.Tasks.query.count(),
        'draw': request.args.get('draw', type=int),
        'searchPanes': searchpanes
    }


@tasks_main.route('/api/bot/task/add', methods=['POST'])
async def add_task_bot():
    logging.info(f"Request add task: {request} from tg_bot by IP {request.remote_addr}")
    data = request.json
    logging.info(data)
    new_row = models.Tasks(**data)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({'success': True, 'taskID': new_row.id})

@tasks_main.route('/api/bot/task/delete', methods=['POST'])
async def delete_task_bot():
    logging.info(f"Request delete task item {request} from tg_bot by IP {request.remote_addr}")
    tasks_id = request.json
    logging.info(tasks_id)
    tasks_item = models.Tasks.query.filter_by(id=tasks_id['taskID']).first()

    if not tasks_item:
        return jsonify({ 'success': False, 'taskID': 'Задача не найдена' })

    db.session.delete(tasks_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    # for i, item in enumerate(models.Tasks.query.all(), 1):
    #     item.id = i
    # db.session.commit()

    return jsonify({ 'success': True, 'taskID': f"Задача с ID {tasks_id['taskID']} удалена" })

@tasks_main.route('/api/bot/tasks/get', methods=['GET'])
async def get_tasks_bot():
    task_list = models.Tasks.query.filter(models.Tasks.status.notin_(["Закрыто", "Выполнено"])).all()
    print(task_list)
    return jsonify([task.serialize() for task in task_list])

@tasks_main.route('/api/tasks/add', methods=['POST'])
@login_required
async def add_task():
    logging.info(f"Request add task: {request.form} from {current_user.username} by IP {request.remote_addr}")
    data = request.form.to_dict()
    tg_notify = data.pop('telegram_notification', False)
    new_row = models.Tasks(**data)
    db.session.add(new_row)
    db.session.commit()
    if tg_notify:
        logging.info(f"Send Telegram notification add task from {current_user.username}")
        users = models.User.query.filter_by(role='User').all()
        await telegram_new_task(new_row, users)
    return jsonify({'success': True})


@tasks_main.route('/api/tasks/get_id')
@login_required
async def get_task_ids():
    logging.info(f"Request get task id from {current_user.username} by IP {request.remote_addr}")
    if current_user.role == 'Admin':
        items = models.Tasks.query.all()
    else:
        items = models.Tasks.query.filter(models.Tasks.status != "Закрыто").all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)
        

@tasks_main.route('/api/tasks/get_item')
@login_required
async def get_task_item():
    logging.info(f"Request get task item from {current_user.username} by IP {request.remote_addr}")
    task_id = request.args.get('id')

    if task_id:
        task = models.Tasks.query.filter_by(id=task_id).first()

        if task:
            return jsonify(task.serialize())

        return jsonify({'error': 'Task not found'})

    return jsonify({'success': False})


@tasks_main.route('/api/tasks/update_item', methods=['POST'])
@login_required
async def update_task_item():
    logging.info(f"Request update task item {request.form} from {current_user.username} by IP {request.remote_addr}")
    data = request.form.to_dict()
    tg_notify = data.pop('telegram_notification', False)
    item = models.Tasks.query.get(data['id'])
    for attribute in models.Tasks.__table__.columns.keys():
        # If the attribute exists in request.form, update its value
        if attribute in request.form:
            setattr(item, attribute, request.form[attribute])
    db.session.commit()
    if tg_notify:
        users = models.User.query.filter_by(role='User').all()
        await telegram_change_task(item, users)
    return jsonify({'success': True})


# @tasks_main.route('/api/tasks/update_item_comment', methods=['POST'])
# @login_required
# def update_item_comment():
#     data = request.form.to_dict()
#     item = models.Tasks.query.get(data['id'])
#     for attribute in models.Tasks.__table__.columns.keys():
#         # Если атрибут есть в request.form, обновляем его значение
#         if attribute есть в request.form:
#             setattr(item, attribute, request.form[attribute])
#     db.session.commit()
#     users = models.User.query.filter_by(role='Admin').all()
#     threading.Thread(target=telegram_update_item_comment, kwargs={'data': data, 'users': users}).start()
#     return jsonify({ 'success': True })

@tasks_main.route('/api/tasks/update_item_status', methods=['POST'])
@login_required
async def update_item_status():
    logging.info(f"Request update task status {request.form} from {current_user.username} by IP {request.remote_addr}")
    data = request.form.to_dict()
    item = models.Tasks.query.filter_by(id=data['id']).first()
    time_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    for attribute in request.form:
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
        await telegram_update_item_status(item, users)
    elif data['status'] == 'Возобновлена':
        users = models.User.query.filter_by(role='User').all()
        await telegram_update_item_status(item, users)
    return jsonify({ 'success': True })



@tasks_main.route('/api/tasks/delete_item', methods=['POST'])
@login_required
async def delete_task_item():
    logging.info(f"Request delete task item {request.form} from {current_user.username} by IP {request.remote_addr}")
    tasks_id = request.form.get('id')
    tasks_item = models.Tasks.query.filter_by(id=tasks_id).first()

    if not tasks_item:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })

    db.session.delete(tasks_item)
    db.session.commit()

    # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
    # for i, item in enumerate(models.Tasks.query.all(), 1):
    #     item.id = i
    # db.session.commit()

    return jsonify({ 'success': True })

async def telegram_new_task(data, users):
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
        logging.info(message.replace('\n', ' '))
        async with aiohttp.ClientSession() as session:
            tasks = []
            for user in users:
                url = f"{API_URL}sendMessage?chat_id={user.telegram}&text={quote(message)}"
                task = asyncio.create_task(send_telegram_message(session, url))
                tasks.append(task)
            await asyncio.gather(*tasks)
            logging.info(f"Send message: new task to {', '.join(user.username for user in users)}: {', '.join(user.telegram for user in users)}")
    except Exception as e:
        logging.critical(f"TG NEW TASK ERROR: {e}")

async def telegram_change_task(data, users):
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
        logging.info(message.replace('\n', ' '))
        async with aiohttp.ClientSession() as session:
            tasks = []
            for user in users:
                url = f"{API_URL}sendMessage?chat_id={user.telegram}&text={quote(message)}"
                task = asyncio.create_task(send_telegram_message(session, url))
                tasks.append(task)
            await asyncio.gather(*tasks)
            logging.info(f"Send message: task updated to {', '.join(user.username for user in users)}: {', '.join(user.telegram for user in users)}")
    except Exception as e:
        logging.critical(f"TG UPDATE TASK ERROR: {e}")

    
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
    

async def telegram_update_item_status(data, users):
    try:
        if data.status != 'Возобновлена':
            message = (
                f"🛠️ ЗАДАЧА ПЕРЕШЛА В НОВЫЙ СТАТУС\n"
                f"🕑 Номер задачи: {data.id}\n"
                f"🔨 Задача: {data.ticket}\n"
                f"⚒️ Описание задачи: {data.ticket_comment}\n"
                f"🟥 Заказчик: {data.user_init}\n"
                f"👁️ Исполнитель: {data.executor}\n"
                f"📈 Статус: {data.status}\n"
            )
        else:
            message = (
                f"🛠️ ЗАДАЧА ВОЗОБНОВЛЕННА\n"
                f"🕑 Номер задачи: {data.id}\n"
                f"🔨 Задача: {data.ticket}\n"
                f"⚒️ Описание задачи: {data.ticket_comment}\n"
                f"🟥 Заказчик: {data.user_init}\n"
                f"📈 Статус: {data.status}\n"
            )
        logging.info(message.replace('\n', ' '))
        async with aiohttp.ClientSession() as session:
            tasks = []
            for user in users:
                url = f"{API_URL}sendMessage?chat_id={user.telegram}&text={quote(message)}"
                task = asyncio.create_task(send_telegram_message(session, url))
                tasks.append(task)
            await asyncio.gather(*tasks)
            logging.info(f"Send message: task status to {', '.join(user.username for user in users)}: {', '.join(user.telegram for user in users)}")

    except Exception as e:
        logging.critical(f"TG UPDATE STATUS ERROR: {e}")
        
        
async def send_telegram_message(session, url):
    async with session.get(url) as response:
        response_text = await response.text()
        # Process the response as needed