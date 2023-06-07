from app import create_app
from werkzeug.middleware.proxy_fix import ProxyFix
from gunicorn.app.base import Application

app = create_app()
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

if __name__ == '__main__':
    Application(app).run()
