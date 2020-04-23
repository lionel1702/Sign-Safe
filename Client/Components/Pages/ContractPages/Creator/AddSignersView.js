import React, {useState} from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import {Backdrop, Box, Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, TextField, Typography} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {callLambdaFunction} from "../../../../Hooks/getDatabase";

const useStyles = makeStyles((theme) => (
	{
		backdrop:
			{
				zIndex: theme.zIndex.drawer + 1,
				color: '#fff',
			},
	}
));

const AddSignersView = props =>
{
	const [expanded, setExpanded] = React.useState('panel1');
	const handleChange = (panel) => setExpanded(expanded === panel ? false : panel);
	const [openBackdrop, setOpenBackdrop] = useState(false);

	const addSigner = () =>
	{
		props.setSigners([...props.signers, {name: "", email: "", ethAddr: ""}]);
		setTimeout(() => {
			handleChange('panel' + (props.signers.length + 1));
			document.getElementById('panel' + (props.signers.length + 1)).scrollIntoView({behavior: "smooth"});
		}, 300);
	};

	return(
		<>
			<Box width={"100%"} height={"100%"}>
				<Grid
					container
					direction={"column"}
					justify={"center"}
					alignItems={"center"}
					alignContent={"center"}
					style={{height: "100%"}}
					spacing={5}
				>
					<Grid item>
						<SignersTable signers={props.signers} setSigners={props.setSigners} expanded={expanded} handleChange={handleChange}/>
					</Grid>
					<Grid item>
						<ActionButtons
							contractUrl={props.contractUrl}
							signers={props.signers}
							addSigner={addSigner}
							setOpenBackDrop={setOpenBackdrop}
						/>
					</Grid>
				</Grid>
			</Box>
			<BackdropConfirm openBackdrop={openBackdrop} setOpenBackdrop={setOpenBackdrop} setUrlStatus={props.setUrlStatus}/>
		</>
	);
};

const BackdropConfirm = props =>
{
	const classes = useStyles();
	return(
		<Backdrop className={classes.backdrop} open={props.openBackdrop} onClick={() => props.setOpenBackdrop(false)}>
			<Paper style={{minWidth: "20vw", minHeight: "20vh"}}>
				<Box m={4}>
					<Grid
						container
						direction={"column"}
						justify={"center"}
						alignItems={"center"}
						alignContent={"center"}
						style={{height: "100%"}}
						spacing={4}
					>
						<Grid item>
							<Typography variant={"h6"} align={"center"}>
								Are you sure? You won't be able to come back to this page.
							</Typography>
						</Grid>
						<Grid item>
							<BackdropButtons setOpenBackdrop={props.setOpenBackdrop} setUrlStatus={props.setUrlStatus}/>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Backdrop>
	);
};

const BackdropButtons = props =>
{
	return(
		<Grid
			container
			justify={"center"}
			alignItems={"center"}
			alignContent={"center"}
			spacing={4}
		>
			<Grid item>
				<Button
					variant={"contained"}
					color={"primary"}
					onClick={() => props.setOpenBackdrop(false)}
				>
					Go Back
				</Button>
			</Grid>
			<Grid item>
				<Button
					variant={"contained"}
					color={"primary"}
					onClick={() => props.setUrlStatus(2)}
				>
					Confirm
				</Button>
			</Grid>
		</Grid>
	);
};

const SignersTable = props =>
{
	return(
		props.signers.map((signer, i) => {
			let setName = (name) => { let copy = [...props.signers]; copy[i].name = name; props.setSigners(copy) };
			let setEmail = (email) => { let copy = [...props.signers]; copy[i].email = email; props.setSigners(copy) };
			let setEthAddr = (ethAddr) => { let copy = [...props.signers]; copy[i].ethAddr = ethAddr; props.setSigners(copy) };

			let title = signer.name ? signer.name : "Signer " + (i + 1);

			return(
				<ExpansionPanel
					key={'panel' + (i + 1)}
					id={'panel' + (i + 1)}
					style={{width: "100%"}}
					expanded={props.expanded === ('panel' + (i + 1))}
					onChange={() => props.handleChange('panel' + (i + 1))}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>{title}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<SignerLayout
							name={signer.name}
							setName={setName}
							email={signer.email}
							setEmail={setEmail}
							ethAddr={signer.ethAddr}
							setEthAddr={setEthAddr}
						/>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			);
		}));
};

const SignerLayout = props =>
{
	return(
		<Grid
			container
			justify={"center"}
			alignItems={"center"}
			alignContent={"center"}
			spacing={4}
		>
			<Grid item>
				<NameField name={props.name} setName={props.setName}/>
			</Grid>
			<Grid item>
				<EmailField email={props.email} setEmail={props.setEmail}/>
			</Grid>
			<Grid item>
				<EthAddrField ethAddr={props.ethAddr} setEthAddr={props.setEthAddr}/>
			</Grid>
		</Grid>
	);
};

const NameField = props =>
{
	return(
		<TextField
			variant={"outlined"}
			label={"Name"}
			value={props.name}
			onChange={(e) => props.setName(e.target.value)}
		/>
	)
};

const EmailField = props =>
{
	return(
		<TextField
			variant={"outlined"}
			label={"Email"}
			value={props.email}
			onChange={(e) => props.setEmail(e.target.value)}
		/>
	)
};

const EthAddrField = props =>
{
	return(
		<TextField
			variant={"outlined"}
			label={"Ethereum Address"}
			value={props.ethAddr}
			onChange={(e) => props.setEthAddr(e.target.value)}
		/>
	)
};

const ActionButtons = props =>
{
	return(
		<Box pb={2}>
			<Grid
				container
				justify={"center"}
				alignItems={"center"}
				alignContent={"center"}
				spacing={4}
			>
				<Grid item>
					<Button
						variant={"contained"}
						color={"primary"}
						onClick={() => props.addSigner()}
					>
						Add Additional Signer
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant={"contained"}
						color={"primary"}
						onClick={() =>
						{
							callLambdaFunction("addSigners", {url: props.contractUrl, signers: props.signers}).then(r => console.log(r));
							props.setOpenBackDrop(true);
						}}
					>
						Finish Adding Signers
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default AddSignersView;
