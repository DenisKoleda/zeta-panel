from flask import Blueprint, jsonify, render_template, request, send_from_directory
from flask_login import login_required, current_user
from . import db, models, os, BASEDIR
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)


@main.route('/')
@login_required
def index():
    return render_template('index.html')


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.username)


@main.route('/changelog')
@login_required
def changelog():
    return render_template('changelog.html', name=current_user.username)


@main.route('/api/upload', methods=['POST'])
@login_required
def upload_image():
    if 'editormd-image-file' not in request.files:
        return jsonify({'success': 0, 'message': 'No file found'})

    file = request.files['editormd-image-file']
    
    if file.filename == '':
        return jsonify({'success': 0, 'message': 'No file selected'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(os.path.join(BASEDIR, 'static', 'upload'), filename))
        
        # Возвращаем URL загруженного изображения в формате, ожидаемом Editor.md
        return jsonify({'success': 1, 'url': '/static/images/' + filename})
    
    return jsonify({'success': 0, 'message': 'Invalid file format'})

@main.route('/static/images/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory((os.path.join(BASEDIR, 'static', 'upload')), filename)

def allowed_file(filename):
    # Допустимые расширения файлов изображений
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS