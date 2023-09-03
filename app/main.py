import uuid
from flask import Blueprint, jsonify, render_template, request, send_from_directory
from flask_login import login_required, current_user
from . import db, models, os, BASEDIR
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)


@main.route('/')
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


@main.route('/download')
@login_required
def show_files():
    folder_path = os.path.join(os.path.join(BASEDIR, 'static', 'download'))
    files = os.listdir(folder_path)
    return render_template('files.html', files=files)

@main.route('/download/<filename>', methods=['GET'])
@login_required
def download_file(filename):
    return send_from_directory(os.path.join(os.path.join(BASEDIR, 'static', 'download')), filename)

@main.route('/api/upload', methods=['POST'])
@login_required
def upload_image():
    if 'editormd-image-file' not in request.files:
        return jsonify({'success': 0, 'message': 'No file found'})

    file = request.files['editormd-image-file']
    
    if file.filename == '':
        return jsonify({'success': 0, 'message': 'No file selected'})
    
    if file and allowed_file(file.filename):
        filename = secure_filename(str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1])
        file.save(os.path.join(os.path.join(BASEDIR, 'static', 'upload'), filename))
        
        # Return the URL of the uploaded image in the expected format for Editor.md
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