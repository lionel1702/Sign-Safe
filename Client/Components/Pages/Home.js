import React from "react";

import { Link } from "react-router-dom";

import { Container, Grid, Typography } from "@material-ui/core";

import PrimaryButton from "../Elements/PrimaryButton";

import { callLambdaFunction }from "../../Hooks/restfulAPI"

const Home = props =>
{
	return(
		<Container>
			<Grid
				container
				justify={"center"}
				alignItems={"center"}
				alignContent={"center"}
				spacing={2}
				style={{height: "100vh"}}
			>
				<Grid item>
					<Link to="/"><Typography align={"center"}>Home</Typography></Link>
				</Grid>
				<Grid item>
					<Link to="/test"><Typography align={"center"}>Test</Typography></Link>
				</Grid>
				<Grid item>
					<PrimaryButton
						text={"Test Mongo"}
						onClick={() => callLambdaFunction("mongo", {hello: "hi"}).then(r => console.log(r))}
					/>
				</Grid>
			</Grid>
		</Container>

	);
};

export default Home;