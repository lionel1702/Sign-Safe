import React, {useState} from "react";

import {Box, CircularProgress, Container, Grid, Typography, Paper} from "@material-ui/core";

import {PrimaryButton} from "./Elements/Buttons";
import {getWeb3, loadWeb3AccountListener} from "../Hooks/getWeb3";

const LayoutTemplate = props =>
{
	let [loading, setLoading] = useState(false);

	return(
		<Container>
			<Grid
				container
				justify={"center"}
				alignItems={"center"}
				alignContent={"center"}
				style={{height: "100vh"}}
			>
				<Paper elevation={3}>
					<Box m={4} width={"85vw"} height={"85vh"} style={{position: "relative"}}>
						{props.innerComponent}
						<div style={{position: 'absolute', top: 0, right: 0}}>
							{loading ? <CircularProgress /> : <Web3Item setLoading={setLoading} {...props} />}
						</div>
					</Box>
				</Paper>
			</Grid>
		</Container>
	);
};

const Web3Item = props =>
{
	if(!props.ethAccount)
	{
		return(
			<PrimaryButton
				size={"small"}
				text={"Log In"}
				onClick={() => {
					props.setLoading(true);
					getWeb3().then(web3Provider => {
						props.setWeb3(web3Provider);
						if (web3Provider)
						{
							web3Provider.eth.getAccounts().then(e => props.setEthAccount(e[0].toLowerCase()));
							loadWeb3AccountListener(props.setEthAccount);
						}

						props.setLoading(false)
					})
				}}
			/>
		);
	}

	const greetings = ["Hello", "Good To See You", "Howdy", "Hi There", "Hey There"];
	const greeting = greetings[Math.floor(Math.random() * greetings.length)];

	return(
		<Typography variant={"subtitle2"} align={"center"}>
			{greeting} {
			props.ethAccount.substring(0, 6) + "..." +
			props.ethAccount.substring(props.ethAccount.length - 4, props.ethAccount.length)}
		</Typography>
	);
};

export default LayoutTemplate;
