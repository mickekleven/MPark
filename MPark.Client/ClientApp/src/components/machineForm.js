import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faEdit, faDashboard, faMessage, faRecycle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { machine } from "../helpers/globals";

export default function MachineForm(props) {
  const [machineS, setMachineS] = useState(machine);
  const machineState = ["Online", "Offline"];
  const [isInsert, setIsInsert] = useState(true);

  useEffect(() => {
    if (props.entity !== null && props.entity !== undefined && props.entity.id !== undefined) {
      console.log("Is not null " + JSON.stringify(props.entity));
      setIsInsert(false);
      setMachineS(props.entity);
    } else {
      setIsInsert(true);
    }
  }, [machineS]);

  const createCheckBoxes = () => {
    return (
      <div className="mt-4 mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            value={props.entity.online}
            checked={props.entity.online}
            onChange={(e) => props.callback(e)}
            type="checkbox"
            name="online"
          ></input>
          <label className="form-check-label" for="flexRadioDefault1">
            Online
          </label>
        </div>
      </div>
    );
  };

  return (
    <>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            type="text"
            onChange={(e) => props.callback(e)}
            value={props.entity.name}
            className="form-control"
          ></input>
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            name="location"
            type="text"
            onChange={(e) => props.callback(e)}
            value={props.entity.location}
            className="form-control"
          ></input>
          <div className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            name="country"
            type="text"
            onChange={(e) => props.callback(e)}
            value={props.entity.country}
            className="form-control"
          ></input>
        </div>

        <div className="mb-3">
          <label className="form-label">Machine type</label>
          <input
            type="text"
            name="machineType"
            onChange={(e) => props.callback(e)}
            value={props.entity.machineType}
            className="form-control"
            aria-describedby="emailHelp"
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            onChange={(e) => props.callback(e)}
            value={isInsert ? props.entity.date : props.entity.date.substring(0, 10)}
            className="form-control"
          ></input>
        </div>

        {/* field for online or offline */}
        <div>{createCheckBoxes()}</div>
        <button
          onClick={() => props.onSubmit(isInsert ? "insert" : "update")}
          type="button"
          className="btn btn-primary"
        >
          {isInsert ? "Add Machine" : "Update machine"}
        </button>
      </form>
    </>
  );
}
