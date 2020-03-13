import React, { useState } from "react";
import { Device, DeviceSummary } from "../../api/dto";
import { mergeDevice } from "../../api";
import { Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import useAllDevices from "../../hooks/useAllDevices";
import { navigate } from "hookrouter";

interface DeviceMergeToolProps {
  device: Device;
}

const DeviceMergeTool: React.FunctionComponent<DeviceMergeToolProps> = ({ device }) => {
  const { devices } = useAllDevices();
  const [showModal, setShowModal] = useState(false);
  const [selectedDestDeviceId, setSelectedDestDeviceId] = useState<
    DeviceSummary | undefined | null
  >(undefined); // null on error
  const [userDestDeviceId, setUserDestDeviceId] = useState<string | undefined>("");
  const [actioning, setActioning] = useState(false);

  const onMerge = () => setShowModal(true);
  const lookupDevice = () => {
    const device = (devices || []).find(d => d.id + "" === userDestDeviceId);
    if (device !== undefined) {
      setSelectedDestDeviceId(device);
    } else {
      setSelectedDestDeviceId(null);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedDestDeviceId(undefined);
    setUserDestDeviceId("");
  };
  const handleModalConfirm = () => {
    if (selectedDestDeviceId !== null && selectedDestDeviceId !== undefined) {
      setActioning(true);
      mergeDevice(device.id, selectedDestDeviceId.id).then(d => {
        navigate(`/devices/${d.id}`);
        setActioning(false);
        handleModalCancel();
      });
    }
  };

  return (
    <>
      <div className="text-right">
        <Button variant="light" onClick={onMerge}>
          Merge With Another Device
        </Button>
      </div>

      <Modal show={showModal} onHide={handleModalCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Merge "{device.name}" ({device.mac_address}) With Another Device?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This action will permanently merge the history from this device into another device;
            this cannot be undone!
          </p>
          <p>
            The discoveries relating to this device will be bound to the device being merged with
            and this device will be deleted.
          </p>

          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text>Destination Device Id</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Device Id"
              value={userDestDeviceId}
              onChange={(event: React.FormEvent<HTMLInputElement>) =>
                setUserDestDeviceId(event.currentTarget.value)
              }
              disabled={selectedDestDeviceId !== undefined}
            />
          </InputGroup>
          {selectedDestDeviceId === undefined ? (
            <Button variant="primary" onClick={lookupDevice}>
              Lookup Device
            </Button>
          ) : selectedDestDeviceId === null ? (
            <div>Error: Could not find device matching the id provided</div>
          ) : (
            <div>
              Selected Device: {selectedDestDeviceId.name} ({selectedDestDeviceId.mac_address})
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalCancel} disabled={actioning}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalConfirm} disabled={actioning}>
            Merge
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeviceMergeTool;
