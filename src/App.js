import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import ReactFlow, { MiniMap, Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { idState } from "./Atom";
import { Parser, TreeToGraphQL } from "graphql-js-tree";
import axios from "axios";
import TextUpdaterNode from "./TextUpdaterNode.js";
import { useRecoilState } from "recoil";
import { generateNode } from './Schema.js';
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 350, y: 100 },
    data: {
      label: "Student",
      type: "type",
      arr: [
        { name: "Name", type: "String" },
        { name: "ID", type: "ID" },
        { name: "Section", type: "String" },
      ],
    },
  },
  {
    id: "node-2",
    type: "textUpdater",
    position: { x: 200, y: 400 },
    data: {
      label: "Teacher",
      type: "interface",
      arr: [
        { name: "Name", type: "String" },
        { name: "ID", type: "ID" },
      ],
    },
  },
  {
    id: "node-3",
    type: "textUpdater",
    position: { x: 500, y: 400 },
    data: {
      label: "Admin",
      type: "type",
      arr: [
        { name: "Name", type: "String" },
        { name: "ID", type: "ID" },
      ],
    },
  },
];

const initialEdges = [
  { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: "a" },
  { id: "edge-2", source: "node-1", target: "node-3", sourceHandle: "b" },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

function App() {

  let fileReader;

  const fileRead = (e) => {
    const content = fileReader.result;
    // console.log(content);
    // const data = eval(content);
    // setNodes(() => data);
    setNodes(() => generateNode(content))
  };

  const fileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = fileRead;
    fileReader.readAsText(file.target.files[0]);
  };

  const [name, setName] = useState("");
  const [posX, setPosX] = useState("");
  const [posY, setPosY] = useState("");
  const [type, setType] = useState("");

  const [pname, setPname] = useState("");
  const [ptype, setPtype] = useState("");

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [value, setValue] = useRecoilState(idState);

  const [sch, setSch]= useState('');

  const [JSONObj, setJSONObj] = useState({
    fileName: "sample.graphqls",
    objects: [],
    query: [],
    mutations: [],
  });

  const [status, setStatus] = useState(false);

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

  const clearNode = () => {
    setNodes(() => []);
  };

  const addNode = (e) => {
    console.log(name, posX, posY);
    console.log(type)
    setNodes((nodes) => {
      return [
        ...nodes,
        {
          id: name,
          type: "textUpdater",
          position: { x: posX, y: posY },
          data: {
            label: name,
            type: type,
            arr: [{
              name: "ID",
              type: "ID"
            }]
          },
        },
      ];
    });
    e.preventDefault();
  };

  useEffect(() => {
    displaySchema();
  },[nodes]);

  const getSchema = () => {
    const parsedSchema = Parser.parse(sch);
    // console.log(parsedSchema)
    let temp= JSONObj;
    const qArr = parsedSchema.nodes.filter(item => item.name==='Query');
    const mArr = parsedSchema.nodes.filter((item) => item.name === "Mutation");
    const oArr = parsedSchema.nodes.filter((item) => item.name !== "Mutation" & item.name!=='Query');
   
    oArr.map((item) => {
      let obj= { name: item.name, fields: [] }
      item.args.map((arg) => {
        let Type;
        if (arg.type.fieldType.name === undefined) {
          Type = arg.type.fieldType.nest.name;
          if (arg.type.fieldType.type === "array") {
            Type = "[" + Type + "]";
          }
          if (arg.type.fieldType.type === "required") {
            Type = Type + "!";
          }
        } else {
          Type = arg.type.fieldType.name;
        }
        let Directive= '';
        if (Type==="ID") {
          Directive = ` @constraint(type:"primarykey")` 
        }
        obj.fields.push({ name: arg.name, type: Type, directive: Directive })
      })
      temp.objects.push(obj)
    })
   
    if (qArr.length>0) {
    qArr[0].args.map((item) => {
      let obj = { name: item.name, returntype: item.type.fieldType.name , arguments: [] };
      item.args.map((arg) => {
        let Type;
        if (arg.type.fieldType.name===undefined) {
            Type = arg.type.fieldType.nest.name
          if (arg.type.fieldType.type === 'array') {
            Type= '[' + Type + ']'
          }
          if (arg.type.fieldType.type === "required") {
            Type = Type + "!";
          }
        }
        else {
            Type = arg.type.fieldType.name;
        }
        obj.arguments.push({ name: arg.name, type: Type });
      });
      temp.query.push(obj);
    });
  }
    
   if (mArr.length>0) {
    mArr[0].args.map((item) => {
      let obj = {
        name: item.name,
        returntype: item.type.fieldType.name,
        arguments: [],
      };
      item.args.map((arg) => {
        let Type;
        if (arg.type.fieldType.name === undefined) {
          Type = arg.type.fieldType.nest.name;
          if (arg.type.fieldType.type === "array") {
            Type = "[" + Type + "]";
          }
          if (arg.type.fieldType.type === "required") {
            Type = Type + "!";
          }
        } else {
          Type = arg.type.fieldType.name;
        }
        obj.arguments.push({ name: arg.name, type: Type });
      });
      temp.mutations.push(obj);
    });
  }

    setJSONObj(temp);
    console.log(JSONObj);

    axios
      .post("http://localhost:8080/", JSONObj)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    
    setJSONObj({
      fileName: "sample.graphqls",
      objects: [],
      query: [],
      mutations: [],
    });
    
  }

  const editNode = (e) => {
      const newState = nodes.map((obj) => {
        if (obj.id === value) {
          let temp = obj.data;
          temp.arr.push({ name: pname, type: ptype });
          console.log(temp);
          setValue('')
          return { ...obj, data: temp };
        }
        return obj;
      });
      console.log(newState);
      setNodes(newState);
      setPname('');
      setPtype('');
      e.preventDefault();
  }

  const displaySchema = () => {
    let schema = "";
    nodes.map((item) => {
      schema = schema + item.data.type + ' ' + item.data.label + ' { \n '
      item.data.arr.map((val,ind) => {
        schema = schema + " " + val.name + ': ' + val.type
        if (ind!==item.data.arr.length-1) {
          schema = schema + ", \n "
        }
        else {
          schema = schema + "\n ";
        }
      })
      schema = schema + '} \n'
    })
    // console.log(schema);
    setSch(schema);
  };

  const onSave = () => {
    setStatus(false);
    setNodes(() => generateNode(sch));
  }

  const changeHandler = (value, event) => {
    setStatus(true);
    setSch(value);
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
          <button className="button" onClick={() => onSave()}>
            Save
          </button>
          <br></br>
          <button
            className="button"
            onClick={() => getSchema()}
            disabled={status}
            style={status ? { background: "grey", borderColor: "grey" } : {}}
          >
            Schema
          </button>
          <br></br>
          <div
            className="modal fade"
            id="exampleModal2"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add Property
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
                    placeholder="Name"
                    value={pname}
                    onChange={(e) => setPname(e.target.value)}
                  />
                  <select
                    className="select-type"
                    aria-label="select example"
                    onChange={(e) => setPtype(e.target.value)}
                  >
                    <option value="null">Select Type</option>
                    <option value="ID">ID</option>
                    <option value="Int">Int</option>
                    <option value="String">String</option>
                  </select>
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
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                    onClick={(e) => editNode(e)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
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
                  <select
                    className="select-type"
                    aria-label="select example"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="null">Select Type</option>
                    <option value="input">input</option>
                    <option value="type">type</option>
                    <option value="interface">interface</option>
                    <option value="enum">enum</option>
                    <option value="union">union</option>
                    <option value="scaler">scaler</option>
                    <option value="extend">extend</option>
                  </select>
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
            accept=".graphqls"
            onChange={(e) => fileChosen(e)}
          />
        </div>
        <div>
          {/* <div className="form-floating">
            <textarea
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{
                height: "980px",
                width: 400,
                fontWeight: 600,
                paddingTop: "40px",
              }}
              value={sch}
              onChange={(e) => changeHandler(e.target.value)}
            ></textarea>
            <label htmlFor="floatingTextarea2">Schema</label>
          </div> */}
          <Editor
            height="980px"
            width="400px"
            defaultLanguage="graphql"
            value={sch}
            onChange={changeHandler}
            // theme="vs-dark"
          />
        </div>
        <div style={{ height: 980, width: 1400 }}>
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
