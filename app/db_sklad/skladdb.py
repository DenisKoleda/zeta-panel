from flask import Blueprint, jsonify, render_template, request
from flask_login import login_required, current_user
from app import db, models, or_
import json
from urllib.parse import urlparse

skladdb = Blueprint('skladdb', __name__)


@skladdb.route('/sklad/pc')
@login_required
def sklad_pc():
    return render_template('sklad/pc.html')

@skladdb.route('/sklad/badgeev')
@login_required
def sklad_badgeev():
    return render_template('sklad/badgeev.html')

@skladdb.route('/sklad/ram')
@login_required
def sklad_ram():
    return render_template('sklad/ram.html')

@skladdb.route('/sklad/motherboard')
@login_required
def sklad_motherboard():
    return render_template('sklad/motherboard.html')

@skladdb.route('/sklad/harddrive')
@login_required
def sklad_harddrive():
    return render_template('sklad/harddrive.html')

@skladdb.route('/sklad/network')
@login_required
def sklad_network():
    return render_template('sklad/network.html')
