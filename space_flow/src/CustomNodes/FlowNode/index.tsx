import { ArrowTopRightOnSquareIcon, Bars3CenterLeftIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Input } from "@mui/material";
import { Handle, Position } from "reactflow";
import { isValidConnection, nodeColors, nodeIcons } from "../../utils";
import ToggleComponent from "../../components/toggleComponent";
import { useContext, useEffect, useState } from "react";
import { typesContext } from "../../contexts/typesContext";
import ParameterComponent from "../GenericNode/components/parameterComponent";

export default function BooleanNode({ data }) {
  const {types, deleteNode} = useContext(typesContext);
  const Icon = nodeIcons[types[data.type]];
  return (
    <div className="prompt-node relative bg-white rounded-lg solid border flex flex-col justify-center">
      <div className="w-full flex items-center justify-between gap-8 p-4 bg-gray-50 border-b ">
        <div className="flex items-center gap-4 text-lg">
          <Icon
            className="w-10 h-10 p-1 rounded"
            style={{ color: nodeColors[types[data.type]] }}
          />
          {data.name}
        </div>
        <button
          onClick={() => {
            
          }}
        >
          <ArrowTopRightOnSquareIcon className="w-6 h-6 hover:text-blue-500"></ArrowTopRightOnSquareIcon>
        </button>
        <button
          onClick={() => {
            deleteNode(data.id);
          }}
        >
          <TrashIcon className="w-6 h-6 hover:text-red-500"></TrashIcon>
        </button>
      </div>
      <div className="w-full h-full py-5">
      <div className="px-5 py-2 mt-2 text-center">Input:</div>
      <ParameterComponent       
        data={data}
        color={
          nodeColors[types[data.type]] ??
          nodeColors[types[data.type]] ??
          "black"
        }
        title={
          'Input'
        }
        name={data.name}
        tooltipTitle={
          "Type: " +
          data.name
        }
        required={data.required}
        id={data.type + data.id}
        left={true}
        type={data.type}
      />
      <div className="px-5 py-2 mt-2 text-center">Output:</div>
      <ParameterComponent       
        data={data}
        color={
          nodeColors[types[data.type]] ??
          nodeColors[types[data.type]] ??
          "black"
        }
        title={
          'Output'
        }
        name={data.name}
        tooltipTitle={
          "Type: " +
          data.name
        }
        required={data.required}
        id={data.type + data.id}
        left={false}
        type={data.type}
      />
      </div>
    </div>
  );
}
