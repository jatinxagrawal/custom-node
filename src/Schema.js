import { Parser } from "graphql-js-tree";

export const generateNode = (data) => {
  const parsedSchema = Parser.parse(data);
  // console.log(parsedSchema)
  let nodesArray = [];
  const oArr = parsedSchema.nodes.filter(
    (item) => (item.name !== "Mutation") & (item.name !== "Query")
  );
  const qArr = parsedSchema.nodes.filter((item) => item.name === "Query");
  const mArr = parsedSchema.nodes.filter((item) => item.name === "Mutation");

  oArr.map((item) => {
    let obj = {
      id: item.name,
      type: "textUpdater",
      position: {
        x: Math.floor(Math.random() * 500 + 1),
        y: Math.floor(Math.random() * 500 + 1),
      },
      data: {
        label: item.name,
        type: item.type.fieldType.name,
        arr: [],
      },
    };
    item.args.map((arg) => {
      let Type;
      if (arg.type.fieldType.name === undefined) {
        Type = arg.type.fieldType.nest.name;
        if (arg.type.fieldType.nest.name === undefined) {
          Type = arg.type.fieldType.nest.nest.name;
        }
        if (arg.type.fieldType.type === "array") {
          Type = "[" + Type + "]";
        }
        if (arg.type.fieldType.type === "required") {
          Type = Type + "!";
        }
      } else {
        Type = arg.type.fieldType.name;
      }
      obj.data.arr.push({ name: arg.name, type: Type });
    });
    nodesArray.push(obj);
  });

  if (qArr.length > 0) {
    let obj = {
      id: "Query",
      type: "textUpdater",
      position: {
        x: Math.floor(Math.random() * 500 + 1),
        y: Math.floor(Math.random() * 500 + 1),
      },
      data: {
        label: "Query",
        type: "type",
        arr: [],
      },
    };
    qArr[0].args.map((item) => {
      let ob = { name: item.name + "(", type: item.type.fieldType.name };
      item.args.map((arg,ind) => {
        let Type;
        if (arg.type.fieldType.name === undefined) {
          Type = arg.type.fieldType.nest.name;
          if (arg.type.fieldType.nest.name === undefined) {
            Type = arg.type.fieldType.nest.nest.name;
          }
          if (arg.type.fieldType.type === "array") {
            Type = "[" + Type + "]";
          }
          if (arg.type.fieldType.type === "required") {
            Type = Type + "!";
          }
        } else {
          Type = arg.type.fieldType.name;
        }
        ob.name = ob.name + arg.name + ": " + Type;
        if (ind !== item.args.length-1) {
          ob.name = ob.name + ", "
        }
      });
      ob.name = ob.name + ")";
      obj.data.arr.push(ob);
    });
    nodesArray.push(obj);
  }

  if (mArr.length > 0) {
    let obj = {
      id: "Mutation",
      type: "textUpdater",
      position: {
        x: Math.floor(Math.random() * 500 + 1),
        y: Math.floor(Math.random() * 500 + 1),
      },
      data: {
        label: "Mutation",
        type: "type",
        arr: [],
      },
    };
    mArr[0].args.map((item) => {
      let ob = { name: item.name + "(", type: item.type.fieldType.name };
      item.args.map((arg,ind) => {
        let Type;
        if (arg.type.fieldType.name === undefined) {
          Type = arg.type.fieldType.nest.name;
          if (arg.type.fieldType.nest.name === undefined) {
            Type = arg.type.fieldType.nest.nest.name;
          }
          if (arg.type.fieldType.type === "array") {
            Type = "[" + Type + "]";
          }
          if (arg.type.fieldType.type === "required") {
            Type = Type + "!";
          }
        } else {
          Type = arg.type.fieldType.name;
        }
        ob.name = ob.name + arg.name + ": " + Type;
        if (ind !== item.args.length - 1) {
          ob.name = ob.name + ", ";
        }
      });
      ob.name = ob.name + ")";
      obj.data.arr.push(ob);
    });
    nodesArray.push(obj);
  }
  return nodesArray;
  //   setNodes(() => nodesArray);
};
