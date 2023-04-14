import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import RiderNavigator from "./RiderNavigator/index";
import DonorNavigator from "./DonorNavigator/index";
import SupplierNavigator from "./SupplierNavigator/index";
import AuthNavigator from "./AuthNavigator/index";
const index = () => {
	const { state } = useContext(AuthContext);
	return state && state.user ? (
		state.user.category == "rider" ? (
			<RiderNavigator />
		) : state.user.category == "donor" ? (
			// <DonorNavigator />
			<></>
		) : (
			// <SupplierNavigator />
			<></>
		)
	) : (
		<AuthNavigator />
	);
};

export default index;
