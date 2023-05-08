import os
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
        SQLALCHEMY_DATABASE_URI=os.environ['SQLALCHEMY_DATABASE_URI']
    )

    # Инициализация экземпляров:
    db.init_app(app)
    mail.init_app(app)
    migrate = Migrate(app, db, "data/migrations")

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
