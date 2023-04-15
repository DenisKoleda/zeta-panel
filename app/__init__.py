from flask import Flask
from flask_login import LoginManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_


db = SQLAlchemy()
mail = Mail()


def create_app():
    app = Flask(__name__)

    # Конфигурация приложения:
    app.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USERNAME='thekolesnikovkirill@gmail.com',
        MAIL_PASSWORD='ynmfpimpqkhrdugs',
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        SECRET_KEY='0f0809b30cb03b7c90d77ecfb35a10a4',
        SQLALCHEMY_DATABASE_URI='sqlite:///db.sqlite'
    )

    # Инициализация экземпляров:
    db.init_app(app)
    mail.init_app(app)

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

    from .skladdb import skladdb as skladdb_blueprint
    app.register_blueprint(skladdb_blueprint)

    return app
