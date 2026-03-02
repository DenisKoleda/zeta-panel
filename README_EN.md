# Zeta-Panel — Task and Warehouse Management Dashboard

Zeta-Panel is a tool for managing tasks and warehouse operations in the Zetalink system. It uses Bootstrap 5, Flask, SQLAlchemy, jQuery, and DataTables JS to provide a convenient and efficient user interface with Telegram support.

## Features

- Task dashboard for viewing, creating, editing, and deleting tasks.
- Warehouse interface for viewing, adding, editing, and deleting inventory.
- Ability to assign responsible people for tasks and warehouse operations.
- Search and filtering for tasks and warehouse operations.
- Interface for tracking task and warehouse operation statuses.
- Telegram status notifications.

## Requirements

- Python 3.7+
- Flask 2.0+
- SQLAlchemy 1.4+
- Bootstrap 5
- jQuery 3.6+
- DataTables JS 1.11+

## Recommended: Docker setup

See the `docker` directory for Docker-based setup instructions.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/DenisKoleda/zeta-panel.git
```

2. Create and activate a virtual environment:

```bash
python3 -m venv .env
source .env/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Prepare the database:

```bash
flask db init
flask db migrate
```

5. Apply migrations:

```bash
flask db migrate
flask db upgrade
```

## Run the web service

```bash
gunicorn wsgi:app \
    --bind localhost:5000 \
    --workers $(nproc) \
    --threads $(nproc) \
    --worker-class=gthread \
    --access-logfile - \
    --error-logfile - \
    --log-level info
```

## Gunicorn settings explained

- `wsgi:app`: points to `wsgi.py` as the Flask entrypoint and its `app` variable.
- `--bind 0.0.0.0:5000`: sets host and port for the web server. In this case, the app is available at `http://localhost:5000` (or all interfaces when configured accordingly).
- `--workers $(nproc)`: number of worker processes based on available CPU cores.
- `--threads $(nproc)`: number of threads per worker, also based on available CPU cores.
- `--worker-class=gthread`: enables a threaded worker class.
- `--access-logfile -`: outputs access logs to stdout.
- `--error-logfile -`: outputs error logs to stdout.
- `--log-level info`: sets logging level.

## Usage

Open `http://localhost:5000` in your browser to access the task and warehouse dashboard.

### Author

Zeta-Panel was created by [Denis Koleda](https://github.com/DenisKoleda).
