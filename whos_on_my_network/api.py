from flask import Flask, request, jsonify

from . import service
from . import utils


app = Flask(__name__, static_url_path='')


@app.route("/", methods=["GET"], endpoint='home')
def root():
    """ Serve React application to all frontend routes """
    return app.send_static_file('index.html')


@app.route("/api/scan/<int:scan_id>", methods=["GET"], endpoint='get_scan_by_id')
def get_scan_by_id(scan_id: int):
    """ Get a scan by id """
    scan = service.get_scan_by_id(scan_id)

    return jsonify(scan.json())


@app.route("/api/scan", methods=["POST"], endpoint='get_scans_by_filter')
def get_scans_by_filter():
    """ Get scan summaries in between two dates (not required) """
    start_date = utils.iso_string_to_datetime(request.json['startDate']) if 'startDate' in request.json else None
    end_date = utils.iso_string_to_datetime(request.json['endDate']) if 'endDate' in request.json else None
    mac_address = request.json['macAddress'] if 'macAddress' in request.json else None

    scan_summaries = service.get_scans_by_filter(start_date, end_date, mac_address)

    return jsonify([s.json() for s in scan_summaries])


@app.route("/api/device/<mac_address>", methods=["GET"], endpoint='get_named_device')
def get_named_device(mac_address: str):
    """ Get details about a named device """
    device = service.get_device(mac_address)

    return jsonify(device.json())


@app.route("/api/device/<mac_address>", methods=["POST"], endpoint='update_named_device')
def update_named_device(mac_address: str):
    """ Update a named device """
    name = request.json['name'] if 'name' in request.json else ''
    note = request.json['note'] if 'note' in request.json else ''

    device = service.update_device(mac_address, name, note)

    return jsonify(device.json())


@app.route("/api/device/<mac_address>", methods=["DELETE"], endpoint='delete_named_device')
def delete_named_device(mac_address: str):
    """ Delete a named device """
    service.delete_device(mac_address)
    return '', 200


# Setup access control

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
