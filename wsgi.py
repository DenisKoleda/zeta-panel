from app import create_app
app = create_app()

if __name__ == '__main__':
    from gunicorn.app.base import Application
    class FlaskApplication(Application):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super(FlaskApplication, self).__init__()

        def load_config(self):
            config = dict([(key, value) for key, value in self.options.items()
                           if key in self.cfg.settings and value is not None])
            for key, value in config.items():
                self.cfg.set(key.lower(), value)

        def load(self):
            return self.application

    options = {
        'bind': '0.0.0.0:5000',
        'workers': 4,
        'threads': 4,
        'worker_class': 'sync'
    }

    FlaskApplication(app, options).run()
