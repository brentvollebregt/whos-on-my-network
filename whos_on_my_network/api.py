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
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None
    # TODO List of devices?
    # TODO List of people?

    scans = scan_service.get_scans_by_filter(start_date, end_date)

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
    search_query = request.json['search_query'] if 'search_query' in request.json else None
    # TODO List of people?
    # TODO Is primary

    devices = device_service.get_devices_by_filter(search_query)

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
    name = request.json['name']
    note = request.json['note']
    owner = int(request.json['owner'])
    is_primary = request.json['is_primary'].lower() == 'true'

    device = device_service.update_device_by_id(device_id, name, note, owner, is_primary)

    dict_response = device.build()
    return jsonify(dict_response)


@app.route("/api/person", methods=["POST"])
def get_people_by_filter():
    """ Get people using a filter """
    search_query = request.json['search_query'] if 'search_query' in request.json else None

    people = people_service.get_people_by_filter(search_query)

    dict_response = [p.build() for p in people]
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
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
