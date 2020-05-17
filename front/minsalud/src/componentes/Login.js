import React, { Component } from "react";
import { FormErrors } from "./FormErrors";
import './css/login.css';
import {sha256} from 'js-sha256';
import {
	Button,
	FormGroup,
	FormControl,
	FormLabel,
	Container,
	Form,
} from "react-bootstrap";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: "",
			password: "",
			formErrors: { user: "", password: "" },
			userValid: false,
			passwordValid: false,
			formValid: false,
		};
	}

	// handle al hacer submit
	handleUserInput = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
			
		});
	};

	// validar campo
	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;
		let userValid = this.state.userValid;
		let passwordValid = this.state.passwordValid;

		switch (fieldName) {
			case "user":
				userValid = value.length > 0;
				fieldValidationErrors.user = userValid ? "" : " vacio";
				break;
			case "password":
				passwordValid = value.length > 0;
				fieldValidationErrors.password = passwordValid ? "" : " vacia";
				break;
			default:
				break;
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				userValid: userValid,
				passwordValid: passwordValid,
			},
			this.validateForm
		);
	}

	// validar el formulario
	validateForm() {
		this.setState({
			formValid: this.state.userValid && this.state.passwordValid,
		});
	}

	// errores
	errorClass(error) {
		return error.length === 0 ? "" : "has-error";
	}

	//Envio de la peticion a la API de usuarios
	envioUsuario(user, hpass, e){
		e.preventDefault()
		const hash = sha256(hpass)
		const url = 'https://6iubewzdng.execute-api.sa-east-1.amazonaws.com/dev/login';
		console.log(hash);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				user: `${user}`,
				phash: `${hpass}`
			})
		};
		fetch(url, requestOptions)
			.then(response => response.json())
			.then(data => console.log(data));


	}
	
	render() {
		return (
			<Container className="form-login">
				<Form className="demoForm">
					<h2>Inicio de Sesión</h2>
					<div className="panel panel-default">
						<FormErrors formErrors={this.state.formErrors} />
					</div>
					<div className={`form-group ${this.errorClass(this.state.formErrors.user)}`}>
						<label htmlFor="user">Usuario</label>
						<input
							type="user"
							required
							className="form-control"
							name="user"
							placeholder="Usuario"
							value={this.state.user}
							onChange={this.handleUserInput}
						/>
					</div>
					<div className={`form-group ${this.errorClass(this.state.formErrors.password)}`} >
						<label htmlFor="password">Contraseña</label>
						<input
							type="password"
							className="form-control"
							name="password"
							placeholder="Contraseña"
							value={this.state.password}
							onChange={this.handleUserInput}
						/>
					</div>
					<Button type="submit" className="btn btn-primary" disabled={!this.state.formValid} onClick={(e) => this.envioUsuario(this.state.user,this.state.password, e)}>
						Enviar
					</Button>
				</Form>
			</Container>
		);
	}
}

export default Login;