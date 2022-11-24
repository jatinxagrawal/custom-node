import React, { useCallback, useState } from "react";
import "./App.css";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import TextUpdaterNode from "./TextUpdaterNode.js";

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 100, y: 20 },
    data: { label: "Student", p1: "Name", p1type: "String", p2: "ID", p2type: "Number", p3: "Section", p3type: "String" },
  },
  {
    id: "node-2",
    type: "output",
    targetPosition: "top",
    position: { x: 20, y: 400 },
    data: { label: "Project" },
  },
  {
    id: "node-3",
    type: "output",
    targetPosition: "top",
    position: { x: 220, y: 400 },
    data: { label: "Lab" },
  },
];

const initialEdges = [
  { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: "a" },
  { id: "edge-2", source: "node-1", target: "node-3", sourceHandle: "b" },
];

const nodeTypes = { textUpdater: TextUpdaterNode };


// const initialNodes = [
//   { id: "1", position: { x: 20, y: 20 }, data: { label: "Node 1" } },
//   { id: "2", position: { x: 50, y: 100 }, data: { label: "Node 2" } },
//   { id: "3", position: { x: 100, y: 200 }, data: { label: "Node 3" } },
//   { id: "4", position: { x: 150, y: 400 }, data: { label: "Node 4" } },
//   { id: "5", position: { x: 200, y: 300 }, data: { label: "Node 5" } },
// ];

// const initialEdges = [
//   { id: "e1-2", source: "1", target: "2", label: "to", type: "step" },
//   { id: "e1-5", source: "1", target: "5", label: "to", type: "step" },
//   { id: "e3-5", source: "3", target: "5", label: "to", type: "step" },
//   { id: "e2-3", source: "2", target: "3", label: "to", type: "step" },
// ];

function App() {

  let fileReader;

  const fileRead = (e) => {
    const content = fileReader.result;
    console.log(content);
    const data = eval(content);
    setNodes(() => data);
  };

  const fileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = fileRead;
    fileReader.readAsText(file.target.files[0]);
  };

  const [name, setName] = useState("");
  const [posX, setPosX] = useState("");
  const [posY, setPosY] = useState("");
  const [p1, setP1] = useState("");
  const [p1T, setP1T] = useState("");
  const [p2, setP2] = useState("");
  const [p2T, setP2T] = useState("");
  const [p3, setP3] = useState("");
  const [p3T, setP3T] = useState("");

  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges]
  // );

  const clearNode = () => {
    setNodes(() => []);
  };

  const addNode = (e) => {
    console.log(name, posX, posY);
    setNodes((nodes) => {
      return [
        ...nodes,
        {
          id: name,
          type: "textUpdater",
          position: { x: posX, y: posY },
          data: {
            label: name,
            p1: p1,
            p1type: p1T,
            p2: p2,
            p2type: p2T,
            p3: p3,
            p3type: p3T,
          },
        },
      ];
    });
    e.preventDefault();
  };

  const displaySchema = () => {
    console.log(nodes);
  };

  return (
    <>
      <div className="main">
        <div className="sidediv">
          <button className="button" onClick={() => clearNode()}>
            Clear
          </button>
          <br></br>
          <button
            className="button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add
          </button>
          <br></br>
          <button className="button" onClick={() => displaySchema()}>
            Schema
          </button>
          <br></br>
          <div
            className="modal fade"
            id="exampleModal"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add Node
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form"
                    type="text"
                    placeholder="Node Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="form"
                    id="posInput"
                    type="number"
                    placeholder="Position X"
                    onChange={(e) => setPosX(e.target.value)}
                  />
                  <input
                    className="form"
                    id="posInput"
                    type="number"
                    placeholder="Position Y"
                    onChange={(e) => setPosY(e.target.value)}
                  />
                  <br></br>
                  <input
                    className="form"
                    type="text"
                    placeholder="Property 1"
                    onChange={(e) => setP1(e.target.value)}
                  />
                  <input
                    className="form"
                    type="text"
                    placeholder="Type"
                    onChange={(e) => setP1T(e.target.value)}
                  />
                  <br></br>
                  <input
                    className="form"
                    type="text"
                    placeholder="Property 2"
                    onChange={(e) => setP2(e.target.value)}
                  />
                  <input
                    className="form"
                    type="text"
                    placeholder="Type"
                    onChange={(e) => setP2T(e.target.value)}
                  />
                  <br></br>
                  <input
                    className="form"
                    type="text"
                    placeholder="Property 3"
                    onChange={(e) => setP3(e.target.value)}
                  />
                  <input
                    className="form"
                    type="text"
                    placeholder="Type"
                    onChange={(e) => setP3T(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={(e) => addNode(e)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <label htmlFor="file-input" className="labelLoad">
            Load
          </label>
          <input
            type="file"
            id="file-input"
            accept=".txt"
            onChange={(e) => fileChosen(e)}
          />
        </div>
        <div>
          <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{ height: "980px", width: 400 }}
              value={JSON.stringify(nodes)}
            ></textarea>
            <label htmlFor="floatingTextarea2">Schema</label>
          </div>
        </div>
        <div style={{ height: 950, width: 800 }}>
          {/* <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow> */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}

export default App;
