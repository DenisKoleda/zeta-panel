from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models, or_
import json
from urllib.parse import urlparse
