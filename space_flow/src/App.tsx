import "reactflow/dist/style.css";
import { useState, useEffect, useContext } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import ErrorAlert from "./alerts/error";
import NoticeAlert from "./alerts/notice";
import SuccessAlert from "./alerts/success";
import ExtraSidebar from "./components/ExtraSidebarComponent";
import { alertContext } from "./contexts/alertContext";
import { locationContext } from "./contexts/locationContext";
import Sidebar from "./components/SidebarComponent";
import Header from "./components/HeaderComponent";
import { TabsManager } from "./pages/FlowPage/flowManager";

export default function App() {
	var _ = require("lodash");

	let { setCurrent, setShowSideBar, setIsStackedOpen } =
		useContext(locationContext);
	let location = useLocation();
	useEffect(() => {
		setCurrent(location.pathname.replace(/\/$/g, "").split("/"));
		setShowSideBar(true);
		setIsStackedOpen(true);
	}, [location.pathname, setCurrent, setIsStackedOpen, setShowSideBar]);

	const {
		errorData,
		errorOpen,
		setErrorOpen,
		noticeData,
		noticeOpen,
		setNoticeOpen,
		successData,
		successOpen,
		setSuccessOpen,
	} = useContext(alertContext);

	const [alertsList, setAlertsList] = useState([]);
	useEffect(() => {
		if (errorOpen && errorData) {
			setErrorOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "error", data: _.cloneDeep(errorData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		} else if (noticeOpen && noticeData) {
			setNoticeOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "notice", data: _.cloneDeep(noticeData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		} else if (successOpen && successData) {
			setSuccessOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "success", data: _.cloneDeep(successData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		}
	}, [errorData, errorOpen, noticeData, noticeOpen, successData, successOpen]);

	const removeAlert = (id: number) => {
		setAlertsList((prevAlertsList) =>
			prevAlertsList.filter((alert) => alert.id !== id)
		);
	};

	return (
		//need parent component with width and height
		<div className="h-full flex flex-col">
			<div className="flex grow-0 shrink basis-auto">
				<Header></Header>
			</div>
			<div className="flex grow shrink basis-auto min-h-0 flex-1 overflow-hidden">
				<Sidebar />
				<ExtraSidebar />
				{/* Main area */}
				<main className="min-w-0 flex-1 border-t border-gray-200 flex">
					{/* Primary column */}
					<div className="w-full h-full">
						<TabsManager></TabsManager>
					</div>
				</main>
			</div>
			<div className="flex z-50 flex-col-reverse fixed bottom-5 left-5">
				{/* alert instances of alert context */}
				{alertsList.map((alert) => (
					<div key={alert.id}>
						{alert.type === "error" ? (
							<ErrorAlert
								key={alert.id}
								title={alert.data.title}
								list={alert.data.list}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						) : alert.type === "notice" ? (
							<NoticeAlert
								key={alert.id}
								title={alert.data.title}
								link={alert.data.link}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						) : (
							<SuccessAlert
								key={alert.id}
								title={alert.data.title}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
