import React from 'react';
import { Handle, Position } from "reactflow";
import { useRecoilState } from 'recoil';
import { idState } from './Atom';

const handleStyle = { left: 10 };

export default function TextUpdaterNode(props) {

  const [id, setID] = useRecoilState(idState);

  const buttonHandler = (v) => {
    setID(v);
    console.log(v,'vs',id);
  }

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} />
      <div>
          <h6 id='head'>
            <span style={{'color': 'blue'}}>{props.data.type}</span> {props.data.label}
          </h6>
        {props.data.arr.length > 0 &&
          props.data.arr.map((item, ind) => {
            return (
              <p key={ind}>
                {item.name} <span id="span">{item.type}</span>
              </p>
            );
          })}
        <center>
          <button
            type="button"
            style={{ border: "1px solid white", marginBottom: "10px" }}
            data-bs-toggle="modal"
            data-bs-target="#exampleModal2"
            onClick={() => buttonHandler(props.id)}
          >
            +
          </button>
        </center>
      </div>
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
      /> */}
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}
