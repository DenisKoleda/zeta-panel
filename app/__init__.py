import os
import logging.handlers
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_

db = SQLAlchemy()
mail = Mail()
TOKEN = os.environ['TOKEN']
API_URL = f'https://api.telegram.org/bot{TOKEN}/'
BASEDIR = os.path.abspath(os.path.dirname(__file__))

# Set up log file paths
APP_LOG_FILE = os.path.join('logs', 'app.log')
DEBUG_LOG_FILE = os.path.join('logs', 'debug.log')
ERROR_LOG_FILE = os.path.join('logs', 'errors.log')

# Create rotating file handlers for each log file
app_handler = logging.handlers.RotatingFileHandler(
    APP_LOG_FILE, maxBytes=100000000, backupCount=5)
debug_handler = logging.handlers.RotatingFileHandler(
    DEBUG_LOG_FILE, maxBytes=100000000, backupCount=5)
error_handler = logging.handlers.RotatingFileHandler(
    ERROR_LOG_FILE, maxBytes=100000000, backupCount=5)

# Set log message format
formatter = logging.Formatter(
    '%(asctime)s - %(filename)s - %(levelname)s - %(message)s')

# Set level for each handler
app_handler.setLevel(logging.INFO)
debug_handler.setLevel(logging.DEBUG)
error_handler.setLevel(logging.ERROR)

# Set formatter for each handler
app_handler.setFormatter(formatter)
debug_handler.setFormatter(formatter)
error_handler.setFormatter(formatter)

# Set up the root logger with all handlers
logging.basicConfig(level=logging.DEBUG,
                    handlers=[app_handler, debug_handler, error_handler])

# Add stderr as a handler for the root logger
console = logging.StreamHandler()
console.setFormatter(formatter)
logging.getLogger().addHandler(console)


def create_app():
    app = Flask(__name__)

    # Конфигурация приложения:
    app.config.update(
        MAIL_SERVER='smtp.yandex.ru',
        MAIL_PORT=587,
        MAIL_USERNAME='info@zetalink.ru',
        MAIL_PASSWORD='datacenter13',
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        SECRET_KEY='0f0809b30cb03b7c90d77ecfb35a10a4',
        SQLALCHEMY_DATABASE_URI=os.environ['SQLALCHEMY_DATABASE_URI'],
    )

    # Инициализация экземпляров:
    db.init_app(app)
    mail.init_app(app)
    Migrate(app, db)

    # Создание экземпляра LoginManager для работы с аутентификацией пользователей:
    login_manager = LoginManager(app)
    # Перенаправление на страницу входа при отсутствии доступа
    login_manager.login_view = 'auth.login'

    # Загрузка пользователя для каждого запроса:
    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Регистрация синихпринтов для работы с авторизацией и главным приложением:
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .sklad.skladdb import skladdb as skladdb_blueprint
    app.register_blueprint(skladdb_blueprint)
    
    from .sklad.skladdb_api_pc import skladdb_api_pc as skladdb_api_pc_blueprint
    app.register_blueprint(skladdb_api_pc_blueprint)
    
    from .sklad.skladdb_api_badgeev import skladdb_api_badgeev as skladdb_api_badgeev_blueprint
    app.register_blueprint(skladdb_api_badgeev_blueprint)
    
    from .sklad.skladdb_api_ram import skladdb_api_ram as skladdb_api_ram_blueprint
    app.register_blueprint(skladdb_api_ram_blueprint)
    
    from .sklad.skladdb_api_motherboard import skladdb_api_motherboard as skladdb_api_motherboard_blueprint
    app.register_blueprint(skladdb_api_motherboard_blueprint)
    
    from .sklad.skladdb_api_harddrive import skladdb_api_harddrive as skladdb_api_harddrive_blueprint
    app.register_blueprint(skladdb_api_harddrive_blueprint)
    
    from .sklad.skladdb_api_network import skladdb_api_network as skladdb_api_network_blueprint
    app.register_blueprint(skladdb_api_network_blueprint)
    
    from .sklad.skladdb_api_miscellaneous import skladdb_api_miscellaneous as skladdb_api_miscellaneous_blueprint
    app.register_blueprint(skladdb_api_miscellaneous_blueprint)
    
    from .tasks.tasks_main import tasks_main as tasks_main_blueprint
    app.register_blueprint(tasks_main_blueprint)
    
    from .wiki.wiki_main import wiki_main as wiki_main_blueprint
    app.register_blueprint(wiki_main_blueprint)

    return app
