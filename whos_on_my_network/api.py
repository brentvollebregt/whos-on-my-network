from flask import Flask, request, jsonify

from . import utils
from .service import scan as scan_service
from .service import device as device_service
from .service import people as people_service


app = Flask(__name__, static_url_path='')


@app.route("/", methods=["GET"], endpoint='home')
def root():
    """ Serve React application to all frontend routes """
    return app.send_static_file('index.html')


@app.route("/api/scan", methods=["POST"])
def get_scans_by_filter():
    """ Get scan summaries in between two dates (not required) """
    ids = request.json['ids'] if 'ids' in request.json else None
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None
    device_ids = request.json['device_ids'] if 'device_ids' in request.json else None
    owner_ids = request.json['owner_ids'] if 'owner_ids' in request.json else None
    limit = request.json['limit'] if 'limit' in request.json else None
    page = request.json['page'] if 'page' in request.json else None

    scans = scan_service.get_scans_by_filter(ids, start_date, end_date, device_ids, owner_ids, limit, page)

    dict_response = [s.build() for s in scans]
    return jsonify(dict_response)


@app.route("/api/scan/<int:scan_id>", methods=["GET"])
def get_scan_by_id(scan_id: int):
    """ Get a scan by id """
    scan = scan_service.get_scan_by_id(scan_id)

    dict_response = scan.build()
    return jsonify(dict_response)


@app.route("/api/device", methods=["POST"])
def get_devices_by_filter():
    """ Get devices using a filter """
    ids = request.json['ids'] if 'ids' in request.json else None
    search_query = request.json['search_query'] if 'search_query' in request.json else None
    owner_id = request.json['owner_id'] if 'owner_id' in request.json else None
    is_primary = request.json['is_primary'] if 'is_primary' in request.json else None

    devices = device_service.get_devices_by_filter(ids, search_query, owner_id, is_primary)

    dict_response = [d.build() for d in devices]
    return jsonify(dict_response)


@app.route("/api/device/<int:device_id>", methods=["GET"])
def get_device_by_id(device_id: int):
    """ Get a device by id """
    device = device_service.get_device_by_id(device_id)

    dict_response = device.build()
    return jsonify(dict_response)


@app.route("/api/device/<int:device_id>", methods=["POST"])
def update_device_by_id(device_id: int):
    """ Update device by id """
    name: str = request.json['name']
    note: str = request.json['note']
    owner_id: int = request.json['ownerId']
    is_primary: bool = request.json['isPrimary']

    device = device_service.update_device_by_id(device_id, name, note, owner_id, is_primary)

    dict_response = device.build()
    return jsonify(dict_response)


@app.route("/api/person", methods=["POST"])
def get_people_by_filter():
    """ Get people using a filter """
    ids = request.json['ids'] if 'ids' in request.json else None
    name_partial = request.json['name_partial'] if 'name_partial' in request.json else None

    people = people_service.get_people_by_filter(ids, name_partial)

    dict_response = [p.build() for p in people]
    return jsonify(dict_response)


@app.route("/api/person", methods=["PUT"])
def create_person():
    """ Create a new person """
    name = request.json['name'] if 'name' in request.json else 'New Person'

    person = people_service.create_person(name)

    dict_response = person.build()
    return jsonify(dict_response)


@app.route("/api/person/<int:person_id>", methods=["GET"])
def get_person_by_id(person_id: int):
    """ Get a person by id """
    person = people_service.get_person_by_id(person_id)

    dict_response = person.build()
    return jsonify(dict_response)


@app.route("/api/person/<int:person_id>", methods=["POST"])
def update_person_by_id(person_id: int):
    """ Update a person by id """
    name = request.json['name']
    note = request.json['note']

    person = people_service.update_person_by_id(person_id, name, note)

    dict_response = person.build()
    return jsonify(dict_response)


# Setup access control

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
