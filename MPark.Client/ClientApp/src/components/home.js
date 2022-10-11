import { useState, useEffect, useCallback } from "react";
import { convertToArray, sortCollection, collectionSort, FindItem } from "../helpers/utilFunctions";
import MachineForm from "../components/machineForm";
import ModalPopup from "../components/modalPopup";
import { machine } from "../helpers/globals";
import {
  DeleteMachine,
  GetMachines,
  InsertMachine,
  UpdateToggleOnOff,
  UpdateMachine,
} from "../Services/machineService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faDashboard,
  faMessage,
  faTrash,
  } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [collection, setCollection] = useState([]);
  const [entity, setEntity] = useState(machine);
  const [header, setHeader] = useState("");
    const [machDelete, setMachDelete] = useState({id: "", name: "", isDelete : false});

  const onHandleModal = () => {
    setShowForm(!showForm);
  };

  // Passed in as function to childform
  const callback = useCallback(
    (event) => {
      const value = event.target.name === "online" ? event.target.checked : event.target.value;
      const name = event.target.name;
      setEntity(
        {
          ...entity,
          [name]: value,
        },
        [entity]
      );
    },
    [entity]
  );

  const onShowForm = () => {
    if (showForm) {
      return (
        <ModalPopup isOpen={showForm} onHandleModal={onHandleModal} header={header}>
          <div>
            <MachineForm entity={entity} callback={callback} onSubmit={onSubmit} />
          </div>
        </ModalPopup>
      );
    }
  };

  const onInsert = () => {
    setHeader("Add machine");
    setEntity({});
    setShowForm(!showForm);
  };

  const onSubmit = async (crudOption) => {
    let response;
    switch (crudOption.toLowerCase()) {
      case "insert":
        response = await insertMachine(entity);
        setEntity(machine);
        break;
      case "update":
        response = await updateMachine(entity);
        setEntity(machine);
        break;
      case "delete":
        response = await deleteMachine(entity);
        setEntity(machine);
        break;
    }

    var entities = await getMachines();
    setCollection(entities);
    setShowForm(!showForm);
  };

  // Update machine
  const onUpdate = (id, _showForm) => {
    setHeader("Update machine");
    setShowForm(_showForm);

    let _entity = collection.find((x) => x.id === id);
    if (_entity !== null) setEntity(_entity);
  };

  const onDelete = async (id, _showForm) => {
    let entity = collection.find((x) => x.id === id);
    if (entity === null) return;

    const response = await deleteMachine(id);
    setCollection(response);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMachines();
      setCollection(data);
    };

    fetchData();
  }, [collection.length]);

  const onToggle = async (id) => {
    const findItem = FindItem(collection, (i) => i.id === id);
    const _collection = await toggleOnOffLine(collection, id);
    setCollection(_collection);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="container bg-c-secondary shadow shadow-3">
        <div className="row">
          <div className="col-md-12 bg-c-primary">
            <h1 className="display-2 mb-4 text-start text-light border p-4">
              <span>{<FontAwesomeIcon icon={faDashboard} />} </span>Dashboard
            </h1>
          </div>
          <div className="col-md-3 shadow border border-3">
            <h1>Daily statistics</h1>
            <button className="btn btn-primary" onClick={() => getMachines()}>
              Get Machines
            </button>
          </div>
          <div className="col-md-9 shadow border border-3">
            <div className="mt-4" style={{ float: "right", marginRight: "2rem" }}>
              <button className="btn btn-primary" onClick={() => onInsert()}>
                {showForm ? "Close" : "Add Device"}
              </button>
            </div>

            {onShowForm()}

            {/* Table */}

            <div className="col-md-12 text-start">
              <h1 className="display-5">Devices</h1>
              <p>Nr of machines: {collection?.length}</p>
              <p>
                Online{" "}
                {
                  collection?.filter((k) => {
                    return k.online === true;
                  }).length
                }
                | Offline{" "}
                {
                  collection?.filter((k) => {
                    return k.online === false;
                  }).length
                }
              </p>
            </div>

            <table className="table">
              <thead className="text-start h5">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Country</th>
                  <th scope="col">Date</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="text-start h6">
                {collection?.map((val, key) => {
                  return (
                    <tr scope="row" key={key}>
                      <td>{val.id}</td>
                      <td>{val.name}</td>
                      <td>{val.location}</td>
                      <td>{val.country}</td>
                      <td>{val.date.substring(0, 10)}</td>
                      <td>{val.machineType}</td>
                      <td
                        onClick={() => onToggle(val.id)}
                        className={val.online ? "bg-c-primary text-light" : "bg-danger text-light"}
                      >
                        {val.online ? "ONLINE" : "OFFLINE"}
                      </td>
                      <td>
                        <span
                          onClick={() => onUpdate(val.id, true)}
                          className={`me-2 ${val.online ? "text-c-primary" : "text-muted"} `}
                        >
                          {<FontAwesomeIcon icon={faEdit} />}
                        </span>
                        <span className={`me-2 ${val.online ? "text-c-primary" : "text-muted"} `}>
                          {<FontAwesomeIcon icon={faMessage} />}
                        </span>
                        <span onClick={() => onDelete(val.id, true)} className="text-danger">
                          {<FontAwesomeIcon icon={faTrash} />}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

//Get machines
async function getMachines() {
  let response = await GetMachines();
  return sortCollection(response, (a, b) => (b.date > a.date ? 1 : -1));
}

// insert item
async function insertMachine(_formData) {
  var response = await InsertMachine(_formData);
  return await getMachines();
}

// Update item
async function updateMachine(_formData) {
  var response = await UpdateMachine(_formData);
  return await getMachines();
}

// Delete item
async function deleteMachine(_id) {
  var response = await DeleteMachine(_id);
  return await getMachines();
}

async function toggleOnOffLine(_collection, id) {
  let _entity = FindItem(_collection, (i) => i.id === id);

  if (_entity === null || _entity === undefined) {
    console.log("Missing item");
    return;
  }

  _entity.online = !_entity.online;

  const response = await UpdateToggleOnOff(_entity, id);
  console.log("response " + JSON.stringify(response));

  let _response = await getMachines();
  return await getMachines();
}
