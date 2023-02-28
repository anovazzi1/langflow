import { useCallback, useContext, useEffect, useRef } from "react";
import ReactFlow, {
	Background,
	Controls,
	addEdge,
	useEdgesState,
	useNodesState,
	useReactFlow,
	ControlButton,
} from "reactflow";
import { locationContext } from "../../contexts/locationContext";
import ExtraSidebar from "./components/extraSidebarComponent";
import Chat from "../../components/chatComponent";
import GenericNode from "../../CustomNodes/GenericNode";
import connection from "./components/connection";
import ChatInputNode from "../../CustomNodes/ChatInputNode";
import ChatOutputNode from "../../CustomNodes/ChatOutputNode";
import InputNode from "../../CustomNodes/InputNode";
import BooleanNode from "../../CustomNodes/BooleanNode";
import { alertContext } from "../../contexts/alertContext";
import { TabsContext } from "../../contexts/tabsContext";
import { typesContext } from "../../contexts/typesContext";
import {
	ArrowDownTrayIcon,
	ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const nodeTypes = {
	genericNode: GenericNode,
	inputNode: InputNode,
	chatInputNode: ChatInputNode,
	chatOutputNode: ChatOutputNode,
	booleanNode: BooleanNode,
};

var _ = require("lodash");

export default function FlowPage({ flow }) {
	let { updateFlow, incrementNodeId, downloadFlow, uploadFlow } =
		useContext(TabsContext);
	const { types, reactFlowInstance, setReactFlowInstance } =
		useContext(typesContext);
	const reactFlowWrapper = useRef(null);

	function getId() {
		return `dndnode_` + incrementNodeId();
	}

	const { setExtraComponent, setExtraNavigation } = useContext(locationContext);
	const { setErrorData } = useContext(alertContext);
	//set flow initial data
	const [nodes, setNodes, onNodesChange] = useNodesState(
		flow.data?.nodes ?? []
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState(
		flow.data?.edges ?? []
	);
	const { setViewport } = useReactFlow();
	//save actual state of the flow when a node or an edge is added
	useEffect(() => {
		if (reactFlowInstance && flow) {
			flow.data = reactFlowInstance.toObject();
			updateFlow(flow);
		}
	}, [nodes, edges]);
	//update flow when the flow props change
	useEffect(() => {
		setViewport(flow?.data?.viewport ?? { x: 1, y: 0, zoom: 1 });
		setNodes(flow?.data?.nodes ?? []);
		setEdges(flow?.data?.edges ?? []);
	}, [flow, reactFlowInstance, setEdges, setNodes]);
	useEffect(() => {
		setExtraComponent(<ExtraSidebar />);
		setExtraNavigation({ title: "Nodes" });
	}, [setExtraComponent, setExtraNavigation]);

	const onEdgesChangeMod = useCallback(
		(s) => {
			onEdgesChange(s);
			setNodes((x) => {
				let newX = _.cloneDeep(x);
				return newX;
			});
		},
		[onEdgesChange, setNodes]
	);

	const onConnect = useCallback(
		(params) => {
			setEdges((eds) =>
				addEdge({ ...params, className: "animate-pulse" }, eds)
			);
			setNodes((x) => {
				let newX = _.cloneDeep(x);
				return newX;
			});
		},
		[setEdges, setNodes]
	);

	const onDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event) => {
			event.preventDefault();

			const reactflowBounds = reactFlowWrapper.current.getBoundingClientRect();
			let data = JSON.parse(event.dataTransfer.getData("json"));
			if (
				data.type !== "chatInput" ||
				(data.type === "chatInput" &&
					!reactFlowInstance.getNodes().some((n) => n.type === "chatInputNode"))
			) {
				const position = reactFlowInstance.project({
					x: event.clientX - reactflowBounds.left,
					y: event.clientY - reactflowBounds.top,
				});
				let newId = getId();

				const newNode = {
					id: newId,
					type:
						data.type === "str"
							? "inputNode"
							: data.type === "chatInput"
							? "chatInputNode"
							: data.type === "chatOutput"
							? "chatOutputNode"
							: data.type === "bool"
							? "booleanNode"
							: "genericNode",
					position,
					data: {
						...data,
						id: newId,
						value: null,
					},
				};
				setNodes((nds) => nds.concat(newNode));
			} else {
				setErrorData({
					title: "Error creating node",
					list: ["There can't be more than one chat input."],
				});
			}
		},
		[reactFlowInstance, setErrorData, setNodes]
	);

	return (
		<div className="w-full h-full" ref={reactFlowWrapper}>
			{/* wait for loading types before render the flow */}
			{Object.keys(types).length > 0 ? (
				<>
					<ReactFlow
						nodes={nodes}
						onMove={() =>
							updateFlow({ ...flow, data: reactFlowInstance.toObject() })
						}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChangeMod}
						onConnect={onConnect}
						onLoad={setReactFlowInstance}
						onInit={setReactFlowInstance}
						nodeTypes={nodeTypes}
						connectionLineComponent={connection}
						onDragOver={onDragOver}
						onDrop={onDrop}
					>
						<Background />
						<Controls>
							<ControlButton
								className="text-black hover:text-blue-500"
								onClick={() => uploadFlow()}
							>
								<ArrowUpTrayIcon />
							</ControlButton>

							<ControlButton
								className="text-black hover:text-blue-500"
								onClick={() => downloadFlow()}
							>
								<ArrowDownTrayIcon />
							</ControlButton>
						</Controls>
					</ReactFlow>
					<Chat flow={flow} reactFlowInstance={reactFlowInstance} />
				</>
			) : (
				<></>
			)}
		</div>
	);
}
