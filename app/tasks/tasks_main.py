from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models

tasks_main = Blueprint('tasks_main', __name__)


@tasks_main.route('/tasks')
@login_required
def tasks_maim_page():
    return render_template('tasks/task_main.html')


@tasks_main.route('/api/tasks/get_tasks', methods=['GET'])
@login_required
def api_get_tasks():
    task_list = models.Tasks.query.all()
    return jsonify([task.serialize() for task in task_list])


@tasks_main.route('/api/tasks/add_row_task', methods=['POST'])
@login_required
def add_row_task():
    date = request.form['date']
    user_init = request.form['user_init']
    ticket = request.form['ticket']
    ticket_comment = request.form['ticket_comment']
    priority = request.form['priority']
    status = request.form['status']
    executor = request.form['executor']
    deadline = request.form['deadline']    
    try:
        last_id = models.Tasks.query.order_by(models.Tasks.id.desc()).first().id
    except:
        last_id = 0
    new_row = models.Tasks(date=date, user_init=user_init, ticket=ticket, ticket_comment=ticket_comment, priority=priority, status=status, executor=executor, deadline=deadline)
    db.session.add(new_row)
    db.session.commit()
    return jsonify({
        'id': last_id + 1,
        'date': date,
        'ticket': ticket,
        'ticket_comment': ticket_comment,
        'priority': priority,
        'status': status,
        'executor': executor,
        'deadline': deadline
    })

@tasks_main.route('/api/tasks/get_tasks_id')
@login_required
def get_tasks_id():
    items = models.Tasks.query.all()
    items_dict = [{'id': item.id} for item in items]
    return jsonify(items_dict)

@tasks_main.route('/api/tasks/get_task_item')
@login_required
def get_task_item():
    id = request.args.get('id')
    if id is not None:
        item = models.Tasks.query.filter_by(id=id).first()
        if item:
            return jsonify({'date': item.date, 'ticket': item.ticket, 'ticket_comment': item.ticket_comment, 'priority': item.priority, 'status': item.status, 'executor': item.executor, 'deadline': item.deadline})
    return jsonify({'error': 'Item not found'})


@tasks_main.route('/api/tasks/update_task_item', methods=['POST'])
@login_required
def update_task_item():
    date = request.form['date']
    user_init = request.form['user_init']
    ticket = request.form['ticket']
    ticket_comment = request.form['ticket_comment']
    priority = request.form['priority']
    status = request.form['status']
    executor = request.form['executor']
    deadline = request.form['deadline']   
    item = models.Tasks.query.get(id)
    item.date = date
    item.user_init = user_init
    item.ticket = ticket
    item.ticket_comment = ticket_comment
    item.priority = priority
    item.status = status
    item.executor = executor
    item.deadline = deadline
    db.session.commit()
    return jsonify({'success': True})

@tasks_main.route('/api/sklad/delete_task_item', methods=['POST'])
@login_required
def delete_task_item():
    tasks_id = request.form.get('id')
    tasks_item = models.Tasks.query.filter_by(id=tasks_id).first()

    if tasks_item:
        db.session.delete(tasks_item)
        db.session.commit()

        # Сдвигаем ID других элементов, чтобы избежать проблем с отсутствующими ID
        tasks_item = models.Tasks.query.all()
        for i in range(len(tasks_item)):
            tasks_item[i].id = i + 1

        db.session.commit()

        return jsonify({ 'success': True })
    else:
        return jsonify({ 'success': False, 'error': 'Элемент не найден' })