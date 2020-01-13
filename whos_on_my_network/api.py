import arrow
from flask import Flask, request, jsonify

from . import service
from . import dto


app = Flask(__name__, static_url_path='')


@app.route("/", methods=["GET"], endpoint='home')
def root():
    """ Serve React application to all frontend routes """
    return app.send_static_file('index.html')


@app.route("/scan", methods=["POST"], endpoint='scans_by_date')
def scans_by_date():
    """ Get scan summaries in between two dates (not required) """
    start_date = arrow.get(request.json['start_date']).datetime if 'start_date' in request.json else None
    end_date = arrow.get(request.json['start_date']).datetime if 'end_date' in request.json else None

    scan_summaries = service.get_scans_between_dates(start_date, end_date)

    return jsonify([s.json() for s in scan_summaries])


@app.route("/scan/<int:scan_id>", methods=["GET"], endpoint='scan_by_id')
def scan_by_id(scan_id: int):
    """ Get a scan by id """
    scan = service.get_scan(scan_id)

    return jsonify(scan.json())


@app.route("/device/<mac_address>", methods=["GET"], endpoint='get_named_device')
def get_named_device(mac_address: str):
    """ Get details about a named device """
    device = service.get_named_device(mac_address)

    return jsonify(dto.NamedDevice(device).json())


@app.route("/device/<mac_address>", methods=["POST"], endpoint='update_named_device')
def update_named_device(mac_address: str):
    """ Update a named device """
    name = request.json['name'] if 'name' in request.json else ''
    note = request.json['note'] if 'note' in request.json else ''

    device = service.update_named_device(mac_address, name, note)

    return jsonify(dto.NamedDevice(device).json())


@app.route("/device/<mac_address>", methods=["DELETE"], endpoint='delete_named_device')
def delete_named_device(mac_address: str):
    """ Delete a named device """
    service.delete_named_device(mac_address)
    return '', 200


# Setup access control

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, Authorization"
    return response
