import React from 'react'
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

export default function TextUpdaterNode(props) {

    // const onChange = useCallback((evt) => {
    //   console.log(evt.target.value);
    // }, []);

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} />
      <div>
        <center><h5>{props.data.label}</h5></center>
        <p>{props.data.p1} <span id='span'>{props.data.p1type}</span></p>
        <p>{props.data.p2} <span id='span'>{props.data.p2type}</span></p>
        <p>{props.data.p3} <span id='span'>{props.data.p3type}</span></p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        // style={handleStyle}
      />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}
