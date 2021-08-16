from pathlib import Path

from flask import Flask, request, jsonify

from . import config
from . import utils
from .service import scan as scan_service
from .service import device as device_service
from .service import people as people_service
from .service import discovery as discovery_service
from .service import external as external_service
from .service import scanning as scanning_service


app = Flask(__name__, static_url_path='')


def pre_flight_checks() -> bool:
    """ Checks to make before the server starts. Server can start if any of these fail """
    # Check if the static folder has been created by the webapp build step
    if not (Path(__file__).absolute().parent / 'static').exists():
        print('WARNING: static directory does not exist in module root. Build the webapp to populate this directory.')
        return False
    return True


@app.route("/", methods=["GET"])
@app.route("/scans", methods=["GET"])
@app.route("/scans/<int:id>", methods=["GET"])
@app.route("/devices", methods=["GET"])
@app.route("/devices/<int:id>", methods=["GET"])
@app.route("/people", methods=["GET"])
@app.route("/people/<int:id>", methods=["GET"])
@app.route("/current", methods=["GET"])
def root(id=None):
    """ Serve React application to all frontend routes """
    return app.send_static_file('index.html')


@app.route("/api/scan", methods=["POST"])
def get_scans_by_filter():
    """ Get scan summaries in between two dates (not required) """
    ids = request.json['ids'] if 'ids' in request.json else None
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None
    device_ids = request.json['deviceIds'] if 'deviceIds' in request.json else None
    owner_ids = request.json['ownerIds'] if 'ownerIds' in request.json else None
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


@app.route("/api/device/<int:source_device_id>/merge", methods=["POST"])
def merge_device(source_device_id: int):
    """ Merge two devices. Device id in url gets merged into device id in body (body device MAC address is used) """
    destination_device_id: int = request.json['destinationDeviceId']

    device = device_service.merge_devices(source_device_id, destination_device_id)

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


@app.route("/api/person/<int:person_id>", methods=["DELETE"])
def delete_person_by_id(person_id: int):
    """ Delete a person by id """
    try:
        people_service.delete_person_by_id(person_id)
        return "Person deleted", 200
    except:
        return "A person with that id does not exist", 400


@app.route("/api/device/discovery-times", methods=["POST"])
def get_device_discovery_times():
    """ Get times devices were discovered by id """
    ids = request.json['ids'] if 'ids' in request.json else None
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None

    discovery_times = discovery_service.get_discovery_times_for_devices(ids, start_date, end_date)

    dict_response = utils.serialize_dict(discovery_times)
    return jsonify(dict_response)


@app.route("/api/person/discovery-times", methods=["POST"])
def get_person_discovery_times():
    """ Get times people were discovered by id """
    ids = request.json['ids'] if 'ids' in request.json else None
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None

    discovery_times = discovery_service.get_discovery_times_for_people(ids, start_date, end_date)

    dict_response = utils.serialize_dict(discovery_times)
    return jsonify(dict_response)


@app.route("/api/external/mac-lookup/<mac_address>", methods=["GET"])
def get_mac_address_vendor(mac_address: str):
    """ Get a mac addresses vendor """
    vendor = external_service.get_mac_address_vendor(mac_address)
    return vendor


@app.route("/api/run/single-scan", methods=["GET"])
def run_single_scan():
    """ Run a single scan and return the scan id """
    scan_id = scanning_service.scan_network_single(config.DEFAULT_NETWORK_ID, config.DEFAULT_PLUGIN, False)
    scan = scan_service.get_scan_by_id(scan_id)

    dict_response = scan.build()
    return jsonify(dict_response)


# Setup access control

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
